import db from '../config/db.js';

export const getActiveDiscount = async (code) => {
  const [rows] = await db.execute(
    'SELECT * FROM discounts WHERE code = ? AND is_active = 1',
    [code]
  );
  return rows[0];
};
