const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['https://aarushic001403.github.io', 'https://backend-k6ko.onrender.com', 'http://localhost:5001'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test database connection
app.get('/api/test', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT 1 as test');
    res.json({ message: 'Database connected successfully', data: rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

// ==================== WORKER MASTER API ====================

// Get all workers
app.get('/api/workers', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Worker_Master ORDER BY Worker_ID DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workers', details: error.message });
  }
});

// Get worker by ID
app.get('/api/workers/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Worker_Master WHERE Worker_ID = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Worker not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch worker', details: error.message });
  }
});

// Add new worker
app.post('/api/workers', async (req, res) => {
  try {
    const { Worker_ID, Age, Gender, Address, State, Qualification, Skill, Aadhar_Number, PF_Number, Blood_Group, Remarks } = req.body;
    const [result] = await db.execute(
      'INSERT INTO Worker_Master (Worker_ID, Age, Gender, Address, State, Qualification, Skill, Aadhar_Number, PF_Number, Blood_Group, Remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [Worker_ID, Age, Gender, Address, State, Qualification, Skill, Aadhar_Number, PF_Number, Blood_Group, Remarks]
    );
    res.status(201).json({ 
      message: 'Worker added successfully', 
      workerId: Worker_ID 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add worker', details: error.message });
  }
});

// Update worker
app.put('/api/workers/:id', async (req, res) => {
  try {
    const { Worker_ID, Age, Gender, Address, State, Qualification, Skill, Aadhar_Number, PF_Number, Blood_Group, Remarks } = req.body;
    const [result] = await db.execute(
      'UPDATE Worker_Master SET Worker_ID = ?, Age = ?, Gender = ?, Address = ?, State = ?, Qualification = ?, Skill = ?, Aadhar_Number = ?, PF_Number = ?, Blood_Group = ?, Remarks = ? WHERE Worker_ID = ?',
      [Worker_ID, Age, Gender, Address, State, Qualification, Skill, Aadhar_Number, PF_Number, Blood_Group, Remarks, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Worker not found' });
    }
    res.json({ message: 'Worker updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update worker', details: error.message });
  }
});

// Delete worker
app.delete('/api/workers/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM Worker_Master WHERE Worker_ID = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Worker not found' });
    }
    res.json({ message: 'Worker deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete worker', details: error.message });
  }
});

// ==================== TRADE MASTER API ====================

// Get all trades
app.get('/api/trades', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Trade_Master ORDER BY Trade_Code DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch trades', details: error.message });
  }
});

// Add new trade
app.post('/api/trades', async (req, res) => {
  try {
    const { Trade_Code, Trade_Name, Training_Frequency } = req.body;
    const [result] = await db.execute(
      'INSERT INTO Trade_Master (Trade_Code, Trade_Name, Training_Frequency) VALUES (?, ?, ?)',
      [Trade_Code, Trade_Name, Training_Frequency]
    );
    res.status(201).json({ 
      message: 'Trade added successfully', 
      tradeCode: result.insertId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add trade', details: error.message });
  }
});

// Update trade
app.put('/api/trades/:id', async (req, res) => {
  try {
    const { Trade_Code, Trade_Name, Training_Frequency } = req.body;
    const [result] = await db.execute(
      'UPDATE Trade_Master SET Trade_Code = ?, Trade_Name = ?, Training_Frequency = ? WHERE Trade_Code = ?',
      [Trade_Code, Trade_Name, Training_Frequency, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Trade not found' });
    }
    res.json({ message: 'Trade updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update trade', details: error.message });
  }
});

// Delete trade
app.delete('/api/trades/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM Trade_Master WHERE Trade_Code = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Trade not found' });
    }
    res.json({ message: 'Trade deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete trade', details: error.message });
  }
});

// ==================== TRAINING MASTER API ====================

// Get all trainings
app.get('/api/trainings', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Training_Master ORDER BY Training_Code DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch trainings', details: error.message });
  }
});

// Add new training
app.post('/api/trainings', async (req, res) => {
  try {
    const { Training_Code, Training_Name, Frequency, Training_Incharge } = req.body;
    const [result] = await db.execute(
      'INSERT INTO Training_Master (Training_Code, Training_Name, Frequency, Training_Incharge) VALUES (?, ?, ?, ?)',
      [Training_Code, Training_Name, Frequency, Training_Incharge]
    );
    res.status(201).json({ 
      message: 'Training added successfully', 
      trainingCode: result.insertId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add training', details: error.message });
  }
});

// Update training
app.put('/api/trainings/:id', async (req, res) => {
  try {
    const { Training_Code, Training_Name, Frequency, Training_Incharge } = req.body;
    const [result] = await db.execute(
      'UPDATE Training_Master SET Training_Code = ?, Training_Name = ?, Frequency = ?, Training_Incharge = ? WHERE Training_Code = ?',
      [Training_Code, Training_Name, Frequency, Training_Incharge, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Training not found' });
    }
    res.json({ message: 'Training updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update training', details: error.message });
  }
});

// Delete training
app.delete('/api/trainings/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM Training_Master WHERE Training_Code = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Training not found' });
    }
    res.json({ message: 'Training deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete training', details: error.message });
  }
});

// ==================== DEPARTMENT MASTER API ====================

// Get all departments
app.get('/api/departments', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Department_Master ORDER BY Department_code DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch departments', details: error.message });
  }
});

// Add new department
app.post('/api/departments', async (req, res) => {
  try {
    const { Department_code, Department_Name, Incharge } = req.body;
    // Ensure numeric type for Max_Labour_Count to satisfy NOT NULL INT column
    const maxLabourCountNumber = Number.parseInt(req.body.Max_Labour_Count, 10);
    if (Number.isNaN(maxLabourCountNumber) || maxLabourCountNumber <= 0) {
      return res.status(400).json({ error: 'Invalid Max_Labour_Count' });
    }

    console.log('REQ BODY:', req.body);

    let result;
    // If a Department_code was provided, attempt to insert with it; otherwise let DB auto-increment
    if (Department_code && String(Department_code).trim() !== '') {
      [result] = await db.execute(
        'INSERT INTO Department_Master (Department_code, Department_Name, Incharge, Max_Labour_Count) VALUES (?, ?, ?, ?)',
        [Department_code, Department_Name, Incharge, maxLabourCountNumber]
      );
    } else {
      [result] = await db.execute(
        'INSERT INTO Department_Master (Department_Name, Incharge, Max_Labour_Count) VALUES (?, ?, ?)',
        [Department_Name, Incharge, maxLabourCountNumber]
      );
    }
    res.status(201).json({ 
      message: 'Department added successfully', 
      departmentCode: result.insertId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add department', details: error.message });
  }
});

// Update department
app.put('/api/departments/:id', async (req, res) => {
  try {
    const { Department_code, Department_Name, Incharge, Max_Labour_Count } = req.body;
    const [result] = await db.execute(
      'UPDATE Department_Master SET Department_code = ?, Department_Name = ?, Incharge = ?, Max_Labour_Count = ? WHERE Department_code = ?',
      [Department_code, Department_Name, Incharge, Max_Labour_Count, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json({ message: 'Department updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update department', details: error.message });
  }
});

// Delete department
app.delete('/api/departments/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM Department_Master WHERE Department_code = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete department', details: error.message });
  }
});

// ==================== TRADE REGISTER API ====================

// Get all trade registrations
app.get('/api/trade-registers', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Trade_Register ORDER BY Record_Date DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch trade registrations', details: error.message });
  }
});

// Add new trade registration
app.post('/api/trade-registers', async (req, res) => {
  try {
    const { Worker_ID, Department_Code, Trade_Code, Enrollment_Date, Validity_Date, Status, Remarks } = req.body;
    console.log('REQ BODY:', req.body);
    const [result] = await db.execute(
      'INSERT INTO Trade_Register (Worker_ID, Record_Date, Department_Code, Trade_Code, Enrollment_Date, Validity_Date, Status, Remarks) VALUES (?, NOW(), ?, ?, ?, ?, ?, ?)',
      [Worker_ID, Department_Code, Trade_Code, Enrollment_Date, Validity_Date, Status, Remarks]
    );
    res.status(201).json({ 
      message: 'Trade registration added successfully', 
      id: result.insertId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add trade registration', details: error.message });
  }
});

//Update trade registration
app.put('/api/trade-registers/:id', async (req, res) => {
  try {
    const { Worker_ID, Record_Date, Department_Code, Trade_Code, Enrollment_Date, Validity_Date, Status, Remarks } = req.body;
    
    console.log('UPDATE REQ BODY:', req.body);
    console.log('UPDATE PARAMS:', req.params);
    
    const recordDate = Record_Date.split('T')[0];
    const [result] = await db.execute(
    'UPDATE Trade_Register SET Worker_ID = ?, Department_Code = ?, Trade_Code = ?, Enrollment_Date = ?, Validity_Date = ?, Status = ?, Remarks = ? WHERE Worker_ID = ? AND DATE(Record_Date) = ?',
    [Worker_ID, Department_Code, Trade_Code, Enrollment_Date, Validity_Date, Status, Remarks, req.params.id, recordDate]
);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Trade registration not found' });
    }
    res.json({ message: 'Trade registration updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update trade registration', details: error.message });
  }
});

// Delete trade registration
app.delete('/api/trade-registers/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM Trade_Register WHERE Worker_ID = ? AND Record_Date = ?', [req.params.id, req.body.Record_Date]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Trade registration not found' });
    }
    res.json({ message: 'Trade registration deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete trade registration', details: error.message });
  }
});

// Get trade registrations with validity alerts
app.get('/api/trade-registers/alerts', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        tr.*,
        w.Age,
        w.Gender,
        w.Address,
        w.State,
        w.Qualification,
        w.Skill,
        w.Aadhar_Number,
        w.PF_Number,
        w.Blood_Group,
        w.Remarks as Worker_Remarks,
        d.Department_Name,
        tm.Trade_Name,
        CASE 
          WHEN tr.Validity_Date < CURDATE() THEN 'Overdue'
          WHEN tr.Validity_Date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY) THEN 'Expiring Soon'
          ELSE 'Valid'
        END as Alert_Status,
        DATEDIFF(tr.Validity_Date, CURDATE()) as Days_Until_Expiry
      FROM Trade_Register tr
      LEFT JOIN Worker_Master w ON tr.Worker_ID = w.Worker_ID
      LEFT JOIN Department_Master d ON tr.Department_Code = d.Department_code
      LEFT JOIN Trade_Master tm ON tr.Trade_Code = tm.Trade_Code
      WHERE tr.Validity_Date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)
      ORDER BY tr.Validity_Date ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch trade registration alerts', details: error.message });
  }
});

// Mark trade registration alert as complete
app.put('/api/trade-registers/:id/complete-alert', async (req, res) => {
  try {
    const { Record_Date } = req.body;
    const recordDate = Record_Date.split('T')[0];
    const [result] = await db.execute(
      'UPDATE Trade_Register SET Alert_Completed = TRUE WHERE Worker_ID = ? AND DATE(Record_Date) = ?',
      [req.params.id, recordDate]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Trade registration not found' });
    }
    res.json({ message: 'Trade registration alert marked as complete' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to mark trade registration alert as complete', details: error.message });
  }
});

// Mark trade registration alert as incomplete
app.put('/api/trade-registers/:id/incomplete-alert', async (req, res) => {
  try {
    const { Record_Date } = req.body;
    const recordDate = Record_Date.split('T')[0];
    const [result] = await db.execute(
      'UPDATE Trade_Register SET Alert_Completed = FALSE WHERE Worker_ID = ? AND DATE(Record_Date) = ?',
      [req.params.id, recordDate]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Trade registration alert marked as incomplete' });
    }
    res.json({ message: 'Trade registration alert marked as incomplete' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to mark trade registration alert as incomplete', details: error.message });
  }
});

// ==================== TRAINING REGISTER API ====================

// Get all training registrations
app.get('/api/training-registers', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Training_Register ORDER BY Record_Date DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch training registrations', details: error.message });
  }
});

// Add new training registration
app.post('/api/training-registers', async (req, res) => {
  try {
    const { Worker_ID, Department_Code, Training_Code, Validity_Date, Status, Remarks } = req.body;
    const [result] = await db.execute(
      'INSERT INTO Training_Register (Worker_ID, Record_Date, Department_Code, Training_Code, Validity_Date, Status, Remarks) VALUES (?, NOW(), ?, ?, ?, ?, ?)',
      [Worker_ID, Department_Code, Training_Code, Validity_Date, Status, Remarks]
    );
    res.status(201).json({ 
      message: 'Training registration added successfully', 
      id: result.insertId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add training registration', details: error.message });
  }
});

// Update training registration
app.put('/api/training-registers/:id', async (req, res) => {
  try {
    const { Worker_ID, Record_Date, Department_Code, Training_Code, Validity_Date, Status, Remarks } = req.body;
    const recordDate = Record_Date.split('T')[0];
    const [result] = await db.execute(
      'UPDATE Training_Register SET Worker_ID = ?, Department_Code = ?, Training_Code = ?, Validity_Date = ?, Status = ?, Remarks = ? WHERE Worker_ID = ? AND DATE(Record_Date) = ?',
      [Worker_ID, Department_Code, Training_Code, Validity_Date, Status, Remarks, req.params.id, recordDate]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Training registration not found' });
    }
    res.json({ message: 'Training registration updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update training registration', details: error.message });
  }
});

// Delete training registration
app.delete('/api/training-registers/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM Training_Register WHERE Worker_ID = ? AND Record_Date = ?', [req.params.id, req.body.Record_Date]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Training registration not found' });
    }
    res.json({ message: 'Training registration deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete training registration', details: error.message });
  }
});

// Get training registrations with validity alerts
app.get('/api/training-registers/alerts', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        tr.*,
        w.Age,
        w.Gender,
        w.Address,
        w.State,
        w.Qualification,
        w.Skill,
        w.Aadhar_Number,
        w.PF_Number,
        w.Blood_Group,
        w.Remarks as Worker_Remarks,
        d.Department_Name,
        tm.Training_Name,
        CASE 
          WHEN tr.Validity_Date < CURDATE() THEN 'Overdue'
          WHEN tr.Validity_Date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY) THEN 'Expiring Soon'
          ELSE 'Valid'
        END as Alert_Status,
        DATEDIFF(tr.Validity_Date, CURDATE()) as Days_Until_Expiry
      FROM Training_Register tr
      LEFT JOIN Worker_Master w ON tr.Worker_ID = w.Worker_ID
      LEFT JOIN Department_Master d ON tr.Department_Code = d.Department_code
      LEFT JOIN Training_Master tm ON tr.Training_Code = tm.Training_Code
      WHERE tr.Validity_Date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)
      ORDER BY tr.Validity_Date ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch training registration alerts', details: error.message });
  }
});

// Mark training registration alert as complete
app.put('/api/training-registers/:id/complete-alert', async (req, res) => {
  try {
    const { Record_Date } = req.body;
    const recordDate = Record_Date.split('T')[0];
    const [result] = await db.execute(
      'UPDATE Training_Register SET Alert_Completed = TRUE WHERE Worker_ID = ? AND DATE(Record_Date) = ?',
      [req.params.id, recordDate]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Training registration not found' });
    }
    res.json({ message: 'Training registration alert marked as complete' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to mark training registration alert as complete', details: error.message });
  }
});

// Mark training registration alert as incomplete
app.put('/api/training-registers/:id/incomplete-alert', async (req, res) => {
  try {
    const { Record_Date } = req.body;
    const recordDate = Record_Date.split('T')[0];
    const [result] = await db.execute(
      'UPDATE Training_Register SET Alert_Completed = FALSE WHERE Worker_ID = ? AND DATE(Record_Date) = ?',
      [req.params.id, recordDate]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Training registration alert marked as incomplete' });
    }
    res.json({ message: 'Training registration alert marked as incomplete' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to mark training registration alert as incomplete', details: error.message });
  }
});

// ==================== USER MASTER API ====================

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT ID, UserName, Role, Status FROM User_Master ORDER BY ID DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});

// Add new user
app.post('/api/users', async (req, res) => {
  try {
    const { UserName, Password, Role, Status } = req.body;
    const [result] = await db.execute(
      'INSERT INTO User_Master (UserName, Password, Role, Status) VALUES (?, ?, ?, ?)',
      [UserName, Password, Role, Status]
    );
    res.status(201).json({ 
      message: 'User added successfully', 
      userId: result.insertId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add user', details: error.message });
  }
});

// Update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const { UserName, Password, Role, Status } = req.body;
    const [result] = await db.execute(
      'UPDATE User_Master SET UserName = ?, Password = ?, Role = ?, Status = ? WHERE ID = ?',
      [UserName, Password, Role, Status, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM User_Master WHERE ID = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
});

// Start server
// Basic root route
app.get('/', (_req, res) => {
  res.send('Worker Management API. Try /api/health');
});

// Health check with DB connectivity
app.get('/api/health', async (_req, res) => {
  try {
    const [rows] = await db.execute('SELECT 1 AS ok');
    res.json({ ok: true, data: rows[0] });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});