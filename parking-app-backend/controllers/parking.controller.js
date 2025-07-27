const { ParkingSlot } = require('../models');

/**
 * Create a new parking slot. Only managers should access this controller.
 */
async function createSlot(req, res) {
  const { name, description } = req.body;
  try {
    // Ensure unique name
    const existing = await ParkingSlot.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({ message: 'A slot with this name already exists.' });
    }
    const slot = await ParkingSlot.create({ name, description });
    return res.status(201).json(slot);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to create parking slot.' });
  }
}

/**
 * List all parking slots.
 */
async function listSlots(_req, res) {
  try {
    const slots = await ParkingSlot.findAll();
    return res.status(200).json(slots);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to list parking slots.' });
  }
}

// Atualizar uma vaga
exports.updateSlot = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const slot = await ParkingSlot.findByPk(id);
    if (!slot) return res.status(404).json({ message: 'Vaga não encontrada' });
    slot.name = name || slot.name;
    slot.description = description || slot.description;
    await slot.save();
    res.json(slot);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar vaga', error: err.message });
  }
};

// Deletar uma vaga
exports.deleteSlot = async (req, res) => {
  const { id } = req.params;
  try {
    const slot = await ParkingSlot.findByPk(id);
    if (!slot) return res.status(404).json({ message: 'Vaga não encontrada' });
    await slot.destroy();
    res.json({ message: 'Vaga removida com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao deletar vaga', error: err.message });
  }
};


module.exports = {
  createSlot,
  listSlots,
  updateSlot: exports.updateSlot,
  deleteSlot: exports.deleteSlot,
};
