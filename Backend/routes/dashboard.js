const Income = require('../model/income');
const Expense = require('../model/expense');
const express = require('express');
const router = express.Router();
const userMiddle = require('../middleware/authMiddleware');
const { Types } = require('mongoose');

router.get('/', userMiddle, async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(userId);
        console.log("User ID:", userId);

        // Total Income
        const totalIncomeResult = await Income.aggregate([
            { $match: { user: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalIncome = totalIncomeResult[0]?.total || 0;

        // Total Expense
        const totalExpenseResult = await Expense.aggregate([
            { $match: { user: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalExpense = totalExpenseResult[0]?.total || 0;

        const balance = totalIncome - totalExpense;

        // Last 60 days Income
        const last60DaysIncomeTransactions = await Income.find({
            user: userObjectId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 });

        const incomeLast60Days = last60DaysIncomeTransactions.reduce(
            (sum, txn) => sum + txn.amount,
            0
        );

        // Last 60 days Expense
        const last60DaysExpenseTransactions = await Expense.find({
            user: userObjectId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 });

        const expenseLast60Days = last60DaysExpenseTransactions.reduce(
            (sum, txn) => sum + txn.amount,
            0
        );

        // Latest 5 Transactions (income + expense)
        const latestTransaction = [
            ...(await Income.find({ user: userObjectId }).sort({ date: -1 }).limit(5)).map(txn => ({
                type: 'income',
                amount: txn.amount,
                category: txn.source,
                date: txn.date,
                description: txn.description,
                _id: txn._id
            })),
            ...(await Expense.find({ user: userObjectId }).sort({ date: -1 }).limit(5)).map(txn => ({
                type: 'expense',
                amount: txn.amount,
                category: txn.category,
                date: txn.date,
                description: txn.description,
                _id: txn._id
            }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

        // Final response
        res.json({
            totalIncome,
            totalExpense,
            balance,
            last60DaysIncomeTransactions,
            last60DaysExpenseTransactions,
            incomeLast60Days,
            expenseLast60Days,
            latestTransaction
        });

    } catch (e) {
        console.error("Error in summary route:", e);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
