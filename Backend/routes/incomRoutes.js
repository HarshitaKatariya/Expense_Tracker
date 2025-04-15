const express = require('express')
const router = express.Router()
// const User = require('../model/user')
const Income = require('../model/income')
const userMiddle = require('../middleware/authMiddleware')
const ExcelJS = require('exceljs');


router.post('/addIncome', userMiddle, async (req, res) => {
    const userId = req.user.id

    try {
        const { amount, source, description, date } = req.body
        if (!amount || !source || !description || !date) {
            return res.status(400).json({ message: 'Please fill in all fields' })
        } else {
            const income = new Income({
                user: userId,
                amount,
                source,
                description,
                date: new Date(date)
            });
            await income.save();
            res.json({ message: 'Income added successfully' })
        }

    } catch (e) {
        res.status(400).json({ message: e.message })
    }
})

router.get('/getIncome', userMiddle, async (req, res) => {
    const userId = req.user.id

    try {
        const income = await Income.find({ user: userId }).sort({ date: -1 });
        res.json(income)

    } catch (e) {
        res.status(400).json({ message: e.message })
    }
})


router.get('/downloadIncomeExcel', userMiddle, async (req, res) => {
    const userId = req.user.id;

    try {
        // Fetch user's income data
        const incomeData = await Income.find({ user: userId }).sort({ date: -1 });

        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Income Report');

        // Add header row
        worksheet.columns = [
            { header: 'Date', key: 'date', width: 20 },
            { header: 'Amount', key: 'amount', width: 15 },
            { header: 'Source', key: 'source', width: 25 },
            { header: 'Description', key: 'description', width: 30 }
        ];

        // Add income data rows
        incomeData.forEach(income => {
            worksheet.addRow({
                date: income.date.toISOString().split('T')[0],
                amount: income.amount,
                source: income.source,
                description: income.description
            });
        });

        // Set response headers for download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=income_report.xlsx');

        // Write to response
        await workbook.xlsx.write(res);
        res.end();

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to generate Excel file' });
    }
});


router.delete('/:id', userMiddle, async (req, res) => {
    try {
        await Income.findOneAndDelete({ _id: req.params.id });
        res.json({ message: 'Income deleted successfully' })
    } catch (e) {
        res.status(401).json({
            message: 'Invalid request'
        })
    }
})



module.exports = router