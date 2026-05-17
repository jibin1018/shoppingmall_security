import api from './axios';
import { Event } from '../types';

export const getEvents = () => api.get<Event[]>('/events');
export const getEvent = (id: number) => api.get<Event>(`/events/${id}`);
