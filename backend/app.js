require('dotenv').config();
const express = require("express");
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('./supabaseClient');

const app = express();
app.use(cors());
app.use(express.json());

// ------------------- UPTIME ------------------- //
app.get("/ping", (req, res) => res.status(200).send("pong"));

// ------------------- JWT AUTH ------------------- //
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const jwtToken = authHeader && authHeader.split(' ')[1];
  if (!jwtToken) return res.status(401).json({ error: "Invalid Access Token" });

  jwt.verify(jwtToken, 'MY_SECRET_TOKEN', (error, payload) => {
    if (error) return res.status(401).json({ error: "Invalid Access Token" });
    req.email = payload.email;
    req.role = payload.role;
    next();
  });
};

// ------------------- MEMBERS ------------------- //
app.get("/api/admin/members", authenticateToken, async (req, res) => {
  const { data, error } = await supabase.from('members').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get("/api/admin/members/:email", authenticateToken, async (req, res) => {
  const { email } = req.params;
  const { data, error } = await supabase.from('members').select('*').eq('email', email).single();
  if (error) return res.status(404).json({ error: "Member not found" });
  res.json(data);
});

app.post("/api/admin/members", authenticateToken, async (req, res) => {
  const { name, email, phone, gender, age, joinDate, packageId, active } = req.body;
  const { data: existing } = await supabase.from('members').select('*').eq('email', email).single();
  if (existing) return res.status(400).json({ error: "Member already exists" });

  const memberData = {
    name, email, phone, gender, age,
    join_date: joinDate || new Date().toISOString().split("T")[0],
    package_id: packageId,
    active
  };
  const { data, error } = await supabase.from("members").insert([memberData]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Member added", member: data[0] });
});

app.put("/api/admin/members/:emailId", authenticateToken, async (req, res) => {
  const { emailId } = req.params;
  const { name, email, phone, gender, age, packageId, active } = req.body;
  const { data, error } = await supabase.from('members')
    .update({ name, email, phone, gender, age, package_id: packageId, active })
    .eq('email', emailId)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Member updated", member: data[0] });
});

app.delete("/api/admin/members/:emailId", authenticateToken, async (req, res) => {
  const { emailId } = req.params;
  const { error } = await supabase.from('members').delete().eq('email', emailId);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Member deleted" });
});

// ------------------- PACKAGES ------------------- //
app.post("/api/admin/packages", authenticateToken, async (req, res) => {
  const { name, durationDays, amount, description } = req.body;
  const { data, error } = await supabase.from('fee_packages').insert([{ name, duration_days: durationDays, amount, description }]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Package created", package: data[0] });
});

app.get("/api/admin/packages", authenticateToken, async (req, res) => {
  const { data, error } = await supabase.from('fee_packages').select('*').order('amount', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get("/api/admin/packages/:packageType", authenticateToken, async (req, res) => {
  const { packageType } = req.params;
  const { data, error } = await supabase.from("fee_packages").select("*").eq("name", packageType);
  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0) return res.status(404).json({ error: "Package not found" });
  res.json(data[0]);
});

app.put("/api/admin/packages/:packageId", authenticateToken, async (req, res) => {
  const { packageId } = req.params;
  const { name, durationDays, amount, description } = req.body;
  const { data, error } = await supabase.from('fee_packages').update({ name, duration_days: durationDays, amount, description }).eq('id', packageId).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Package updated", package: data[0] });
});

app.delete("/api/admin/packages/:packageId", authenticateToken, async (req, res) => {
  const { packageId } = req.params;
  const { error } = await supabase.from('fee_packages').delete().eq('id', packageId);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Package deleted" });
});

// ------------------- BILLS ------------------- //
app.post("/api/admin/bills", authenticateToken, async (req, res) => {
  const { memberId, amountPaid, method, name } = req.body;
  const { data, error } = await supabase.from('bills').insert([{ member_id: memberId, amount_paid: amountPaid, method, name }]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Bill added", bill: data[0] });
});

app.get("/api/admin/bills", authenticateToken, async (req, res) => {
  const { data, error } = await supabase.from('bills').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get("/api/admin/bills/member/:memberId", authenticateToken, async (req, res) => {
  const { memberId } = req.params;
  const { data, error } = await supabase.from('bills').select('*').eq('member_id', memberId).order('payment_date', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get("/api/admin/bills/:billId", authenticateToken, async (req, res) => {
  const { billId } = req.params;
  const { data, error } = await supabase.from('bills').select('*').eq('id', billId).single();
  if (error) return res.status(404).json({ error: "Bill not found" });
  res.json(data);
});

// ------------------- NOTIFICATIONS ------------------- //
app.post("/api/admin/notifications", authenticateToken, async (req, res) => {
  const { title, message } = req.body;
  const { data, error } = await supabase.from('notifications').insert([{ title, message }]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Notification added", notification: data[0] });
});

app.get("/api/admin/notifications", authenticateToken, async (req, res) => {
  const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get("/api/admin/notifications/:notificationId", authenticateToken, async (req, res) => {
  const { notificationId } = req.params;
  const { data, error } = await supabase.from('notifications').select('*').eq('id', notificationId).single();
  if (error) return res.status(404).json({ error: "Notification not found" });
  res.json(data);
});

app.delete("/api/admin/notifications/:notificationId", authenticateToken, async (req, res) => {
  const { notificationId } = req.params;
  const { error } = await supabase.from('notifications').delete().eq('id', notificationId);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Notification deleted" });
});

// ------------------- SUPPLEMENTS ------------------- //
app.post("/api/admin/supplements", authenticateToken, async (req, res) => {
  const { name, price, description, stockQuantity, url } = req.body;
  const { data, error } = await supabase.from('supplements').insert([{ name, price, description, stock_quantity: stockQuantity, url }]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Supplement added", supplement: data[0] });
});

app.get("/api/admin/supplements", authenticateToken, async (req, res) => {
  const { data, error } = await supabase.from('supplements').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get("/api/admin/supplements/:supplementId", authenticateToken, async (req, res) => {
  const { supplementId } = req.params;
  const { data, error } = await supabase.from('supplements').select('*').eq('id', supplementId).single();
  if (error) return res.status(404).json({ error: "Supplement not found" });
  res.json(data);
});

app.put("/api/admin/supplements/:supplementId", authenticateToken, async (req, res) => {
  const { supplementId } = req.params;
  const { name, price, description, stockQuantity, url } = req.body;
  const { data, error } = await supabase.from('supplements').update({ name, price, description, stock_quantity: stockQuantity, url }).eq('id', supplementId).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Supplement updated", supplement: data[0] });
});

app.delete("/api/admin/supplements/:supplementId", authenticateToken, async (req, res) => {
  const { supplementId } = req.params;
  const { error } = await supabase.from('supplements').delete().eq('id', supplementId);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Supplement deleted" });
});

// ------------------- DIET PLANS ------------------- //
app.get("/api/admin/diet-plans", authenticateToken, async (req, res) => {
  const { data, error } = await supabase.from('diet_plans').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get("/api/admin/diet-plans/:memberId", authenticateToken, async (req, res) => {
  const { memberId } = req.params;
  const { data, error } = await supabase.from('diet_plans').select('*').eq('member_id', memberId).single();
  if (error) return res.status(404).json({ error: "Diet plan not found" });
  res.json(data);
});

app.post("/api/admin/diet-plans", authenticateToken, async (req, res) => {
  const { member_email, goal, diet_chart } = req.body;

  const { data: member } = await supabase.from('members').select('id').eq('email', member_email).single();
  const { data: admin } = await supabase.from('admins').select('id').eq('email', req.email).single();

  const { data, error } = await supabase.from('diet_plans').insert([{ member_id: member.id, goal, diet_chart, assigned_by: admin.id }]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Diet plan added", diet_plan: data[0] });
});

app.put("/api/admin/diet-plans/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { member_id, goal, diet_chart, assigned_by } = req.body;
  const { data, error } = await supabase.from('diet_plans').update({ member_id, goal, diet_chart, assigned_by }).eq('id', id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Diet plan updated", diet_plan: data[0] });
});

app.delete("/api/admin/diet-plans/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('diet_plans').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Diet plan deleted" });
});

// ------------------- AUTH ------------------- //
app.post("/api/login", async (req, res) => {
  const { email, password, role } = req.body;
  const table = role === "admin" ? "admins" : "members";
  const { data: user } = await supabase.from(table).select('*').eq('email', email).single();
  if (!user) return res.status(400).json({ error_msg: "Invalid email" });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error_msg: "Invalid password" });
  const token = jwt.sign({ email, role, id: user.id }, "MY_SECRET_TOKEN");
  res.json({ jwt_token: token });
});

app.put("/api/reset-password", async (req, res) => {
  const { email, password, role } = req.body;
  const table = role === 'admin' ? 'admins' : 'members';
  const hashed = await bcrypt.hash(password, 10);
  const { error } = await supabase.from(table).update({ password: hashed }).eq('email', email);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Password updated successfully" });
});

// ------------------- ADMIN PROFILE ------------------- //
app.get("/api/admin/profile", authenticateToken, async (req, res) => {
  const { data, error } = await supabase.from('admins').select('*').eq('email', req.email).single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ------------------- SERVER ------------------- //
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
