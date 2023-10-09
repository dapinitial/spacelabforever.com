const express = require('express');
const approvalsController = require('../../controllers/approvalsController');
const router = express.Router();

// Define your routes
router.get('/approvals', approvalsController.getAllApprovals);
router.get('/approvals/:id', approvalsController.getApprovalById);
router.patch('/approvals/:id/approve', approvalsController.approveApproval);
router.patch('/approvals/:id/reject', approvalsController.rejectApproval);
router.delete('/approvals/:id', approvalsController.deleteApproval);
router.delete('/approvals', approvalsController.deleteAllApprovals);

module.exports = router;
