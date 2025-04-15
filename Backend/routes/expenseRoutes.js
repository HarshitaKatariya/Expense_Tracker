const express = require('express')
const router = express.Router()
// const User = require('../model/user')
const Expense = require('../model/expense')
const userMiddle = require('../middleware/authMiddleware')
const ExcelJS = require('exceljs');


router.post('/addExpense', userMiddle, async (req, res) => {
    const userId = req.user.id

    try {
        const { amount, category, description, date } = req.body
        if (!amount || !category || !description || !date) {
            return res.status(400).json({ message: 'Please fill in all fields' })
        } else {
            const expense = new Expense({
                user:userId,
                amount,
                category,
                description,
                date : new Date(date)
            });
            await expense.save();
            res.json({ message: 'Expense added successfully' })
        }

    } catch (e) {
        res.status(400).json({ message: e.message })
    }
})

router.get('/getExpense', userMiddle, async(req, res) => {
    const userId = req.user.id

    try{
        const expense = await Expense.find({ user:userId }).sort({ date : -1 });
        res.json(expense)

    }catch(e){
        res.status(400).json({ message: e.message })
    }
})

router.get('/downloadExpenseExcel', userMiddle, async (req, res) => {
    const userId = req.user.id;

    try {
        // Get all expenses of the user
        const expenses = await Expense.find({ user: userId }).sort({ date: -1 });

        // Create a new Excel workbook and sheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Expense Report');

        // Define columns
        worksheet.columns = [
            { header: 'Date', key: 'date', width: 20 },
            { header: 'Amount', key: 'amount', width: 15 },
            { header: 'Category', key: 'category', width: 20 },
            { header: 'Description', key: 'description', width: 30 },
        ];

        // Add rows
        expenses.forEach(exp => {
            worksheet.addRow({
                date: exp.date.toISOString().split('T')[0],
                amount: exp.amount,
                category: exp.category,
                description: exp.description || ''
            });
        });

        // Set headers for Excel file download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=expense_report.xlsx');

        // Write the Excel file to response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to generate Excel file' });
    }
});

router.delete('/:id', userMiddle, async (req, res) => {
    try{
        await Expense.findOneAndDelete({_id:req.params.id});
        res.json({ message: 'Expense deleted successfully' })
    }catch(e){
        res.status(401).json({
            message: 'Invalid request'
        })
    }
})

module.exports = router