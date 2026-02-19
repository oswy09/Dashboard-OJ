/*
  # Fix Booking Modes Policies

  1. Changes
    - Drop existing restrictive policies
    - Add permissive policies that allow anyone to manage booking modes
    - This matches the pattern used in other tables in the system
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view booking modes" ON booking_modes;
DROP POLICY IF EXISTS "Authenticated users can insert booking modes" ON booking_modes;
DROP POLICY IF EXISTS "Authenticated users can update booking modes" ON booking_modes;
DROP POLICY IF EXISTS "Authenticated users can delete booking modes" ON booking_modes;

-- Create new permissive policies
CREATE POLICY "Anyone can view booking modes"
  ON booking_modes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert booking modes"
  ON booking_modes
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update booking modes"
  ON booking_modes
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete booking modes"
  ON booking_modes
  FOR DELETE
  TO public
  USING (true);