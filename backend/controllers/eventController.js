// 📁 backend/controllers/eventController.js
import Event from '../models/Event.js';
import mongoose from 'mongoose';

// ✅ Create Event
export const createEvent = async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Create Event Error:", error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

// ✅ Get Events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// ✅ Delete Event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
};

// ✅ Register for Event
export const registerEvent = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid event ID' });
  }

  try {
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (event.registered >= event.maxSeats) {
      return res.status(400).json({ error: 'No available slots' });
    }

    event.registered += 1;
    await event.save();

    res.status(200).json(event);
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ error: 'Failed to register' });
  }
};
