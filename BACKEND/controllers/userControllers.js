const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

// Ensure JWT_SECRET is available
if (!process.env.JWT_SECRET) {
    console.error("⚠️ Error: JWT_SECRET is missing in .env file");
    process.exit(1);
}

// ✅ Student Signup
exports.studentSignup = async (req, res) => {
    console.log("🛠 Received Signup Request:", req.body);  // Debugging

    const { name, username, password } = req.body;

    try {
        if (!name || !username || !password) {
            console.log("❌ Missing fields:", { name, username, password });
            return res.status(400).json({ msg: "All fields are required" });
        }

        const studentExists = await Student.findOne({ username });
        console.log("🔍 Checking if student exists:", studentExists);

        if (studentExists) {
            console.log("❌ Student already exists:", username);
            return res.status(400).json({ msg: 'Student already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("🔑 Hashed Password:", hashedPassword);

        const newStudent = new Student({ name, username, password: hashedPassword });
        await newStudent.save();
        
        console.log("✅ Student registered:", newStudent);
        res.status(201).json({ msg: 'Student registered successfully' });
    } catch (err) {
        console.error("❌ Error in student signup:", err);
        res.status(500).json({ msg: 'Server error' });
    }
};




// ✅ Faculty Signup
exports.facultySignup = async (req, res) => {
    const { name, username, password } = req.body;
    try {
        const facultyExists = await Faculty.findOne({ username });
        if (facultyExists) {
            return res.status(400).json({ msg: 'Faculty already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newFaculty = new Faculty({ name, username, password: hashedPassword });
        await newFaculty.save();

        res.status(201).json({ msg: 'Faculty registered successfully' });
    } catch (err) {
        console.error("Error in faculty signup:", err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// ✅ Student Login
exports.studentLogin = async (req, res) => {
    const { username, password } = req.body;
    console.log('Login request received:', username);

    try {
        const student = await Student.findOne({ username });
        if (!student) {
            console.error('Student not found:', username);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            console.error('Password mismatch for user:', username);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: student._id, username: student.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log('Login successful for user:', username);
        res.json({ 
            token, 
            name: student.name, 
            username: student.username  // Helps frontend show username
        });

    } catch (err) {
        console.error('Error during login process:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// ✅ Faculty Login
exports.facultyLogin = async (req, res) => {
    const { username, password } = req.body;
    console.log('Faculty login request received:', username);

    try {
        const faculty = await Faculty.findOne({ username });
        if (!faculty) {
            console.error('Faculty not found:', username);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, faculty.password);
        if (!isMatch) {
            console.error('Password mismatch for faculty:', username);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: faculty._id, username: faculty.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log('Faculty login successful for user:', username);
        res.json({ token, name: faculty.name, username: faculty.username });

    } catch (err) {
        console.error('Error during faculty login process:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// ✅ Admin Login (Static Username/Password)
exports.adminLogin = (req, res) => {
    const { username, password } = req.body;
    if (username === 'bujji' && password === 'nani') {
        const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
    } else {
        return res.status(400).json({ msg: 'Invalid credentials' });
    }
};
