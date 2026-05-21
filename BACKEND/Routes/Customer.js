const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Customer = require('../Models/Customer');

// ── REGISTER ──────────────────────────────
// URL: POST /api/customers/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // 1. Validate required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 2. Check if customer already exists
    const exists = await Customer.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Save new customer to MongoDB
    const customer = new Customer({ name, email, phone, password: hashedPassword });
    await customer.save();

    res.status(201).json({ message: 'Customer registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── LOGIN ─────────────────────────────────
// URL: POST /api/customers/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // 2. Find customer by email
    const customer = await Customer.findOne({ email });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    // 3. Check if account is active
    if (customer.status === 'inactive') {
      return res.status(403).json({ message: 'Account is inactive. Contact support.' });
    }

    // 4. Compare password
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) return res.status(400).json({ message: 'Wrong password' });

    // 5. Return customer WITHOUT password
    const { password: _, ...customerData } = customer._doc;
    res.json({ message: 'Login successful', customer: customerData });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET ALL CUSTOMERS (Admin use) ─────────
// URL: GET /api/customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find()
      .select('-password')
      .sort({ createdAt: -1 }); // newest first
    res.json({ total: customers.length, customers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET ONE CUSTOMER ──────────────────────
// URL: GET /api/customers/:id
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).select('-password');
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── UPDATE CUSTOMER ───────────────────────
// URL: PUT /api/customers/:id
router.put('/:id', async (req, res) => {
  try {
    // Prevent password from being updated here directly
    const { password, ...updateData } = req.body;

    const updated = await Customer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    if (!updated) return res.status(404).json({ message: 'Customer not found' });

    res.json({ message: 'Customer updated successfully', customer: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── CHANGE PASSWORD ───────────────────────
// URL: PUT /api/customers/:id/change-password
router.put('/:id/change-password', async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Both old and new password are required' });
    }

    // 1. Find customer
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    // 2. Verify old password
    const isMatch = await bcrypt.compare(oldPassword, customer.password);
    if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

    // 3. Hash and save new password
    customer.password = await bcrypt.hash(newPassword, 10);
    await customer.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE CUSTOMER ───────────────────────
// URL: DELETE /api/customers/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Customer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;