/*
  # Add Booking Modes Table

  1. New Tables
    - `booking_modes`
      - `id` (uuid, primary key)
      - `name` (text) - Name of the booking mode (e.g., "Calendario Online", "WhatsApp", etc.)
      - `description` (text) - Description of the booking mode
      - `price_cop` (integer) - Price in Colombian Pesos
      - `price_usd` (integer) - Price in US Dollars
      - `order_index` (integer) - Display order
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on `booking_modes` table
    - Add policy for public read access (anyone can view booking modes)
    - Add policy for authenticated users to manage booking modes (for admin)
*/

CREATE TABLE IF NOT EXISTS booking_modes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price_cop integer NOT NULL DEFAULT 0,
  price_usd integer NOT NULL DEFAULT 0,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE booking_modes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view booking modes"
  ON booking_modes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert booking modes"
  ON booking_modes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update booking modes"
  ON booking_modes
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete booking modes"
  ON booking_modes
  FOR DELETE
  TO authenticated
  USING (true);