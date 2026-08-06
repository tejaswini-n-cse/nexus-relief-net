-- ResQNet PostgreSQL schema (FastAPI + SQLAlchemy target)

CREATE TYPE user_role AS ENUM ('citizen','volunteer','ngo','hospital','government','admin');
CREATE TYPE severity_level AS ENUM ('low','moderate','high','critical');
CREATE TYPE request_kind AS ENUM ('rescue','food','water','medicine','shelter');
CREATE TYPE request_status AS ENUM ('pending','assigned','en_route','resolved','cancelled');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email CITEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone TEXT,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  district TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- roles are NEVER stored on the users row (privilege-escalation safe)
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  UNIQUE (user_id, role)
);

CREATE TABLE disasters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  district TEXT NOT NULL,
  severity severity_level NOT NULL,
  ai_severity_score INT CHECK (ai_severity_score BETWEEN 0 AND 100),
  affected INT DEFAULT 0,
  displaced INT DEFAULT 0,
  lat DOUBLE PRECISION, lng DOUBLE PRECISION,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ
);

CREATE TABLE aid_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disaster_id UUID REFERENCES disasters(id) ON DELETE SET NULL,
  requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind request_kind NOT NULL,
  people INT NOT NULL DEFAULT 1,
  description TEXT,
  lat DOUBLE PRECISION, lng DOUBLE PRECISION,
  status request_status NOT NULL DEFAULT 'pending',
  priority severity_level NOT NULL DEFAULT 'moderate',
  ai_priority_score INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON aid_requests (status, ai_priority_score DESC);

CREATE TABLE request_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES aid_requests(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  media_type TEXT NOT NULL,
  ai_damage_grade TEXT
);

CREATE TABLE volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill TEXT, rating NUMERIC(2,1) DEFAULT 5.0,
  missions_completed INT DEFAULT 0,
  availability TEXT DEFAULT 'available',
  lat DOUBLE PRECISION, lng DOUBLE PRECISION
);

CREATE TABLE missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES aid_requests(id) ON DELETE CASCADE,
  volunteer_id UUID NOT NULL REFERENCES volunteers(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'assigned',
  eta_minutes INT,
  evidence_url TEXT,
  accepted_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE shelters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, district TEXT,
  capacity INT NOT NULL, occupied INT NOT NULL DEFAULT 0,
  meals_status TEXT DEFAULT 'adequate',
  lat DOUBLE PRECISION, lng DOUBLE PRECISION
);

CREATE TABLE hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  beds INT, beds_free INT, icu INT, icu_free INT,
  ambulances INT, ambulances_free INT, doctors_on_call INT,
  lat DOUBLE PRECISION, lng DOUBLE PRECISION,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE blood_stock (
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  blood_group TEXT NOT NULL,
  units INT NOT NULL DEFAULT 0,
  PRIMARY KEY (hospital_id, blood_group)
);

CREATE TABLE ngos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL, verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ngo_id UUID REFERENCES ngos(id) ON DELETE CASCADE,
  item TEXT NOT NULL, category TEXT NOT NULL,
  unit TEXT, stock INT DEFAULT 0, allocated INT DEFAULT 0
);

CREATE TABLE distributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ngo_id UUID REFERENCES ngos(id) ON DELETE CASCADE,
  shelter_id UUID REFERENCES shelters(id) ON DELETE SET NULL,
  items TEXT, beneficiaries INT, status TEXT DEFAULT 'scheduled',
  scheduled_at TIMESTAMPTZ, delivered_at TIMESTAMPTZ, proof_url TEXT
);

CREATE TABLE missing_persons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT, age INT, last_seen TEXT,
  disaster_id UUID REFERENCES disasters(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'searching', photo_url TEXT
);

CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL, title TEXT NOT NULL, body TEXT,
  issuer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  geofence JSONB, created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, entity TEXT, entity_id TEXT,
  payload JSONB, created_at TIMESTAMPTZ DEFAULT now()
);
