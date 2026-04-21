import AuditLog from '../models/AuditLog.js';

export const getAuditLogs = async (req, res) => {
  try {
    const filters = {};
    if (req.query.role) filters.role = req.query.role;
    if (req.query.action) filters.action = req.query.action;
    
    const logs = await AuditLog.find(filters).sort({ timestamp: -1 });
      
    res.json(logs.map((log) => {
      const item = log.toJSON();
      return {
        ...item,
        userId: {
          _id: item.actorAuthId,
          name: item.actorName,
          email: item.actorEmail
        }
      };
    }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
