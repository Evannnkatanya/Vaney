-- ============================================================
-- Vaney Database Migration - Supabase PostgreSQL
-- Aplikasi Pencatat Keuangan Pribadi
-- 
-- Jalankan SQL ini di Supabase Dashboard > SQL Editor
-- ============================================================

-- ============================================================
-- 1. CUSTOM ENUM TYPES
-- ============================================================

-- Opsi perlakuan sisa dana akhir periode
CREATE TYPE end_period_choice_enum AS ENUM ('savings', 'carry', 'expire');

-- Jenis akun keuangan
CREATE TYPE account_type_enum AS ENUM ('bank', 'ewallet', 'cash', 'credit_card');

-- Jenis pot alokasi 50/30/20
CREATE TYPE pot_type_enum AS ENUM ('harian', 'bulanan', 'tabungan');

-- Jenis transaksi
CREATE TYPE transaction_type_enum AS ENUM ('income', 'expense', 'transfer');

-- Status sinkronisasi cloud
CREATE TYPE sync_status_enum AS ENUM ('synced', 'pending_upload', 'pending_delete');

-- Frekuensi tagihan berulang
CREATE TYPE bill_frequency_enum AS ENUM ('monthly', 'weekly', 'yearly', 'custom');


-- ============================================================
-- 2. TABEL USERS
-- ============================================================

CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) UNIQUE,
  avatar_url  TEXT,
  pin_hash    VARCHAR(255),                            -- Hash PIN keamanan (opsional)
  is_biometric_enabled BOOLEAN DEFAULT false,          -- Toggle Fingerprint / Face ID
  monthly_income DECIMAL(15,2) DEFAULT 0,              -- Base pemasukan bulanan default
  end_period_choice end_period_choice_enum DEFAULT 'savings', -- Opsi sisa dana akhir periode
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Index email untuk lookup cepat
CREATE INDEX idx_users_email ON users(email);

COMMENT ON TABLE users IS 'Tabel utama data pengguna Vaney';
COMMENT ON COLUMN users.pin_hash IS 'Hash SHA-256 dari PIN 4/6-digit keamanan lokal';
COMMENT ON COLUMN users.monthly_income IS 'Pemasukan bulanan default untuk kalkulasi pot otomatis';
COMMENT ON COLUMN users.end_period_choice IS 'Aturan sisa dana: savings (masuk tabungan), carry (rollover), expire (hangus)';


-- ============================================================
-- 3. TABEL ACCOUNTS (Multi-Akun: Bank, E-Wallet, Cash, CC)
-- ============================================================

CREATE TABLE accounts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name           VARCHAR(100) NOT NULL,                -- Nama akun (e.g. BCA Utama, GoPay)
  type           account_type_enum NOT NULL DEFAULT 'bank',
  balance        DECIMAL(15,2) NOT NULL DEFAULT 0,     -- Saldo manual oleh pengguna
  account_number VARCHAR(50),                          -- Nomor rekening / kartu (opsional)
  icon           VARCHAR(50) DEFAULT 'wallet',         -- Nama ikon Lucide/Material
  is_credit      BOOLEAN DEFAULT false,                -- True jika kartu kredit
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_accounts_user_id ON accounts(user_id);

COMMENT ON TABLE accounts IS 'Akun keuangan pengguna (Bank, E-Wallet, Cash, Credit Card) - saldo dikelola manual';


-- ============================================================
-- 4. TABEL BUDGET_POTS (Alokasi Anggaran 50/30/20)
-- ============================================================

CREATE TABLE budget_pots (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pot_type         pot_type_enum NOT NULL,              -- harian / bulanan / tabungan
  percentage       DECIMAL(5,2) NOT NULL DEFAULT 0,     -- Persentase alokasi (e.g. 50.00)
  allocated_amount DECIMAL(15,2) NOT NULL DEFAULT 0,    -- Nominal target alokasi bulanan
  remaining_amount DECIMAL(15,2) NOT NULL DEFAULT 0,    -- Sisa dana real-time
  period_month     VARCHAR(7),                          -- Periode bulan (e.g. '2026-09')
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now(),

  -- Satu pot_type unik per user per periode
  UNIQUE(user_id, pot_type, period_month)
);

CREATE INDEX idx_budget_pots_user_id ON budget_pots(user_id);
CREATE INDEX idx_budget_pots_period ON budget_pots(period_month);

COMMENT ON TABLE budget_pots IS 'Pot alokasi anggaran otomatis 50/30/20 per bulan';
COMMENT ON COLUMN budget_pots.remaining_amount IS 'Sisa dana real-time yang di-update setiap transaksi';


-- ============================================================
-- 5. TABEL CATEGORY_MAPPINGS (Mapping Kategori ke Pot)
-- ============================================================

CREATE TABLE category_mappings (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name      VARCHAR(100) NOT NULL,                    -- Nama kategori (e.g. Makanan & Minuman)
  pot_type  pot_type_enum NOT NULL DEFAULT 'harian',  -- Mapping ke pot target
  icon_name VARCHAR(50) DEFAULT 'tag',                -- Nama ikon Lucide/Material
  color     VARCHAR(20) DEFAULT '#406651',            -- Warna kategori (hex)
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_category_mappings_user_id ON category_mappings(user_id);
CREATE INDEX idx_category_mappings_pot_type ON category_mappings(pot_type);

COMMENT ON TABLE category_mappings IS 'Mapping kategori transaksi ke pot alokasi pengguna';


-- ============================================================
-- 6. TABEL TRANSACTIONS (Pencatatan Transaksi Keuangan)
-- ============================================================

CREATE TABLE transactions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id    UUID REFERENCES accounts(id) ON DELETE SET NULL,
  category_id   UUID REFERENCES category_mappings(id) ON DELETE SET NULL,
  type          transaction_type_enum NOT NULL DEFAULT 'expense',
  amount        DECIMAL(15,2) NOT NULL CHECK (amount >= 0),
  merchant_name VARCHAR(100),                         -- Nama merchant / toko
  note          TEXT,                                 -- Catatan tambahan transaksi
  date          DATE NOT NULL DEFAULT CURRENT_DATE,   -- Tanggal transaksi
  time_str      VARCHAR(20),                          -- Jam (e.g. "14:30")
  sync_status   sync_status_enum DEFAULT 'synced',
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Indexes untuk query performa tinggi
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_transactions_sync_status ON transactions(sync_status);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);

COMMENT ON TABLE transactions IS 'Catatan transaksi keuangan pengguna (income/expense/transfer)';


-- ============================================================
-- 7. TABEL RECURRING_BILLS (Tagihan Berulang)
-- ============================================================

CREATE TABLE recurring_bills (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name         VARCHAR(100) NOT NULL,                  -- Nama tagihan (e.g. Listrik, WiFi)
  amount       DECIMAL(15,2) NOT NULL DEFAULT 0,       -- Nominal tagihan
  frequency    bill_frequency_enum DEFAULT 'monthly',  -- Frekuensi pembayaran
  due_day      INTEGER CHECK (due_day >= 1 AND due_day <= 31), -- Tanggal jatuh tempo
  category_id  UUID REFERENCES category_mappings(id) ON DELETE SET NULL,
  account_id   UUID REFERENCES accounts(id) ON DELETE SET NULL,
  is_active    BOOLEAN DEFAULT true,
  last_paid_at TIMESTAMPTZ,                            -- Terakhir dibayarkan
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_recurring_bills_user_id ON recurring_bills(user_id);

COMMENT ON TABLE recurring_bills IS 'Tagihan berulang untuk reminder otomatis (Sewa, Listrik, WiFi, Asuransi)';


-- ============================================================
-- 8. AUTO-UPDATE updated_at TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_accounts_updated_at
  BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_budget_pots_updated_at
  BEFORE UPDATE ON budget_pots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ============================================================
-- 9. ROW LEVEL SECURITY (RLS) - Supabase Best Practice
-- ============================================================

-- Enable RLS pada semua tabel
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_pots ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_bills ENABLE ROW LEVEL SECURITY;

-- Policy: User hanya bisa akses data miliknya sendiri

-- USERS: user bisa baca & update data dirinya sendiri
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- ACCOUNTS: user hanya akses akun miliknya
CREATE POLICY "Users can manage own accounts"
  ON accounts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- BUDGET_POTS: user hanya akses pot miliknya
CREATE POLICY "Users can manage own budget pots"
  ON budget_pots FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- CATEGORY_MAPPINGS: user hanya akses kategori miliknya
CREATE POLICY "Users can manage own categories"
  ON category_mappings FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- TRANSACTIONS: user hanya akses transaksi miliknya
CREATE POLICY "Users can manage own transactions"
  ON transactions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RECURRING_BILLS: user hanya akses tagihan miliknya
CREATE POLICY "Users can manage own recurring bills"
  ON recurring_bills FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ============================================================
-- 10. SEED DATA: KATEGORI DEFAULT
-- ============================================================
-- Catatan: Seed ini menggunakan UUID placeholder '00000000-0000-0000-0000-000000000000'.
-- Pada production, ganti user_id dengan UUID pengguna sesungguhnya
-- atau jalankan insert ini setelah user pertama kali mendaftar.

-- INSERT INTO category_mappings (user_id, name, pot_type, icon_name, color) VALUES
--   ('USER_UUID_HERE', 'Makanan & Minuman',  'harian',   'utensils',       '#406651'),
--   ('USER_UUID_HERE', 'Transportasi',       'harian',   'car',            '#3f627a'),
--   ('USER_UUID_HERE', 'Belanja Harian',     'harian',   'shopping-cart',  '#685d4c'),
--   ('USER_UUID_HERE', 'Hiburan',            'bulanan',  'gamepad-2',      '#7c5cb0'),
--   ('USER_UUID_HERE', 'Tagihan & Utilitas', 'bulanan',  'receipt',        '#b05c5c'),
--   ('USER_UUID_HERE', 'Sewa & Cicilan',     'bulanan',  'home',           '#5c7ab0'),
--   ('USER_UUID_HERE', 'Tabungan',           'tabungan', 'piggy-bank',     '#4a8c6f'),
--   ('USER_UUID_HERE', 'Investasi',          'tabungan', 'trending-up',    '#8c6f4a');


-- ============================================================
-- SELESAI! Database Vaney siap digunakan di Supabase. 🎉
-- ============================================================
