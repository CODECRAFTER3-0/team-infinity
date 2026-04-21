import AuditLog from '../models/AuditLog.js';
import { getAccountCollectionByRole } from '../utils/authModels.js';

export const logAction = (action) => {
  return async (req, res, next) => {
    // Save original send and json functions
    const originalSend = res.send;
    const originalJson = res.json;

    // Override res.json to capture response
    res.json = function (body) {
      // Create log entry if request is successful
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Determine targetId based on request
        let targetId = null;
        if (req.params.patientId) targetId = req.params.patientId;
        else if (req.body.patientId) targetId = req.body.patientId;
        else if (req.patient && req.patient._id) targetId = req.patient._id;

        const logData = {
          actorAuthId: req.user._id,
          actorCollection: getAccountCollectionByRole(req.user.role),
          actorName: req.user.name,
          actorEmail: req.user.email,
          role: req.user.role,
          action: action,
          targetId: targetId
        };
        
        AuditLog.create(logData).catch(err => console.error('Failed to write audit log:', err));
      }
      
      // Call original json
      return originalJson.call(this, body);
    };

    next();
  };
};

export const logManualAction = async (userId, role, action, targetId) => {
  try {
    await AuditLog.create({
      actorAuthId: userId,
      actorCollection: getAccountCollectionByRole(role),
      actorName: 'Unknown User',
      actorEmail: '',
      role,
      action,
      targetId
    });
  } catch (error) {
    console.error('Failed to log manual action:', error);
  }
};
