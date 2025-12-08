const Job = require('../models/Job');
const { Op } = require('sequelize');

// Cleanup ist standardmäßig deaktiviert. Diese Datei stellt eine
// kleine, robuste Implementierung bereit, damit der Import sicher ist.
const startJobCleanup = () => {
  // Deaktiviert: kein Cron-Job läuft automatisch in der Dev-Umgebung
  return;
};

const manualCleanup = async () => {
  try {
    const now = new Date();
    const jobsToDelete = await Job.findAll({
      where: {
        scheduledDeletion: { [Op.lte]: now },
        status: { [Op.in]: ['closed', 'abgeschlossen'] }
      }
    });

    if (jobsToDelete.length > 0) {
      await Job.destroy({
        where: { id: { [Op.in]: jobsToDelete.map(j => j.id) } }
      });
      return { deleted: jobsToDelete.length, jobs: jobsToDelete };
    }

    return { deleted: 0, jobs: [] };
  } catch (err) {
    console.error('manualCleanup error', err && err.message ? err.message : err);
    throw err;
  }
};

module.exports = {
  startJobCleanup,
  manualCleanup
};
