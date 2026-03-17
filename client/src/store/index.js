import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/client';

/* ============================================================
   UI Slice — selected date, toasts
   ============================================================ */
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    selectedDate: new Date().toISOString().slice(0, 10),
    toasts: [],
  },
  reducers: {
    setSelectedDate: (state, action) => { state.selectedDate = action.payload; },
    addToast: (state, action) => {
      state.toasts.push({ id: Date.now(), ...action.payload });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
  },
});

export const { setSelectedDate, addToast, removeToast } = uiSlice.actions;

/* helper */
function toast(dispatch, message, type = 'success') {
  dispatch(addToast({ message, type }));
}

/* ============================================================
   Goals Slice
   ============================================================ */
export const fetchGoals = createAsyncThunk('goals/fetch', async (date) => {
  const res = await api.get(`/goals?date=${date}`);
  return res.data;
});
export const createGoal = createAsyncThunk('goals/create', async ({ date, content }, { dispatch }) => {
  const res = await api.post('/goals', { date, content });
  toast(dispatch, 'Goal created');
  return res.data;
});
export const updateGoal = createAsyncThunk('goals/update', async ({ id, content }, { dispatch }) => {
  const res = await api.put(`/goals/${id}`, { content });
  toast(dispatch, 'Goal updated');
  return res.data;
});
export const deleteGoal = createAsyncThunk('goals/delete', async (id, { dispatch }) => {
  await api.delete(`/goals/${id}`);
  toast(dispatch, 'Goal deleted');
  return id;
});

const goalsSlice = createSlice({
  name: 'goals',
  initialState: { items: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (s) => { s.loading = true; })
      .addCase(fetchGoals.fulfilled, (s, a) => { s.items = a.payload; s.loading = false; })
      .addCase(fetchGoals.rejected, (s) => { s.loading = false; })
      .addCase(createGoal.fulfilled, (s, a) => { s.items.push(a.payload); })
      .addCase(updateGoal.fulfilled, (s, a) => {
        const idx = s.items.findIndex(i => i.id === a.payload.id);
        if (idx !== -1) s.items[idx] = a.payload;
      })
      .addCase(deleteGoal.fulfilled, (s, a) => {
        s.items = s.items.filter(i => i.id !== a.payload);
      });
  },
});

/* ============================================================
   Priorities Slice
   ============================================================ */
export const fetchPriorities = createAsyncThunk('priorities/fetch', async (date) => {
  const res = await api.get(`/priorities?date=${date}`);
  return res.data;
});
export const createPriority = createAsyncThunk('priorities/create', async ({ date, title }, { dispatch }) => {
  const res = await api.post('/priorities', { date, title });
  toast(dispatch, 'Priority added');
  return res.data;
});
export const updatePriority = createAsyncThunk('priorities/update', async ({ id, ...data }, { dispatch }) => {
  const res = await api.put(`/priorities/${id}`, data);
  toast(dispatch, 'Priority updated');
  return res.data;
});
export const deletePriority = createAsyncThunk('priorities/delete', async (id, { dispatch }) => {
  await api.delete(`/priorities/${id}`);
  toast(dispatch, 'Priority deleted');
  return id;
});

const prioritiesSlice = createSlice({
  name: 'priorities',
  initialState: { items: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPriorities.pending, (s) => { s.loading = true; })
      .addCase(fetchPriorities.fulfilled, (s, a) => { s.items = a.payload; s.loading = false; })
      .addCase(fetchPriorities.rejected, (s) => { s.loading = false; })
      .addCase(createPriority.fulfilled, (s, a) => { s.items.push(a.payload); })
      .addCase(updatePriority.fulfilled, (s, a) => {
        const idx = s.items.findIndex(i => i.id === a.payload.id);
        if (idx !== -1) s.items[idx] = a.payload;
      })
      .addCase(deletePriority.fulfilled, (s, a) => {
        s.items = s.items.filter(i => i.id !== a.payload);
      });
  },
});

/* ============================================================
   Todos Slice
   ============================================================ */
export const fetchTodos = createAsyncThunk('todos/fetch', async (date) => {
  const res = await api.get(`/todos?date=${date}`);
  return res.data;
});
export const createTodo = createAsyncThunk('todos/create', async ({ date, title }, { dispatch }) => {
  const res = await api.post('/todos', { date, title });
  toast(dispatch, 'Todo added');
  return res.data;
});
export const updateTodo = createAsyncThunk('todos/update', async ({ id, ...data }, { dispatch }) => {
  const res = await api.put(`/todos/${id}`, data);
  return res.data;
});
export const deleteTodo = createAsyncThunk('todos/delete', async (id, { dispatch }) => {
  await api.delete(`/todos/${id}`);
  toast(dispatch, 'Todo deleted');
  return id;
});

const todosSlice = createSlice({
  name: 'todos',
  initialState: { items: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (s) => { s.loading = true; })
      .addCase(fetchTodos.fulfilled, (s, a) => { s.items = a.payload; s.loading = false; })
      .addCase(fetchTodos.rejected, (s) => { s.loading = false; })
      .addCase(createTodo.fulfilled, (s, a) => { s.items.push(a.payload); })
      .addCase(updateTodo.fulfilled, (s, a) => {
        const idx = s.items.findIndex(i => i.id === a.payload.id);
        if (idx !== -1) s.items[idx] = a.payload;
      })
      .addCase(deleteTodo.fulfilled, (s, a) => {
        s.items = s.items.filter(i => i.id !== a.payload);
      });
  },
});

/* ============================================================
   Notes Slice
   ============================================================ */
export const fetchNotes = createAsyncThunk('notes/fetch', async (date) => {
  const res = await api.get(`/notes?date=${date}`);
  return res.data;
});
export const createNote = createAsyncThunk('notes/create', async ({ date, content }, { dispatch }) => {
  const res = await api.post('/notes', { date, content });
  toast(dispatch, 'Note added');
  return res.data;
});
export const updateNote = createAsyncThunk('notes/update', async ({ id, content }, { dispatch }) => {
  const res = await api.put(`/notes/${id}`, { content });
  toast(dispatch, 'Note updated');
  return res.data;
});
export const deleteNote = createAsyncThunk('notes/delete', async (id, { dispatch }) => {
  await api.delete(`/notes/${id}`);
  toast(dispatch, 'Note deleted');
  return id;
});

const notesSlice = createSlice({
  name: 'notes',
  initialState: { items: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (s) => { s.loading = true; })
      .addCase(fetchNotes.fulfilled, (s, a) => { s.items = a.payload; s.loading = false; })
      .addCase(fetchNotes.rejected, (s) => { s.loading = false; })
      .addCase(createNote.fulfilled, (s, a) => { s.items.push(a.payload); })
      .addCase(updateNote.fulfilled, (s, a) => {
        const idx = s.items.findIndex(i => i.id === a.payload.id);
        if (idx !== -1) s.items[idx] = a.payload;
      })
      .addCase(deleteNote.fulfilled, (s, a) => {
        s.items = s.items.filter(i => i.id !== a.payload);
      });
  },
});

/* ============================================================
   Hydration Slice
   ============================================================ */
export const fetchHydration = createAsyncThunk('hydration/fetch', async (date) => {
  const res = await api.get(`/hydration?date=${date}`);
  return res.data;
});
export const updateHydration = createAsyncThunk('hydration/update', async ({ date, glasses }, { dispatch }) => {
  const res = await api.put('/hydration', { date, glasses });
  return res.data;
});

const hydrationSlice = createSlice({
  name: 'hydration',
  initialState: { data: { glasses: 0 }, loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHydration.pending, (s) => { s.loading = true; })
      .addCase(fetchHydration.fulfilled, (s, a) => { s.data = a.payload; s.loading = false; })
      .addCase(fetchHydration.rejected, (s) => { s.loading = false; })
      .addCase(updateHydration.fulfilled, (s, a) => { s.data = a.payload; });
  },
});

/* ============================================================
   Reports Slice
   ============================================================ */
export const fetchReport = createAsyncThunk('reports/fetch', async ({ type, date }) => {
  const res = await api.get(`/reports/${type}?date=${date}`);
  return res.data;
});

const reportsSlice = createSlice({
  name: 'reports',
  initialState: { data: null, loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReport.pending, (s) => { s.loading = true; })
      .addCase(fetchReport.fulfilled, (s, a) => { s.data = a.payload; s.loading = false; })
      .addCase(fetchReport.rejected, (s) => { s.loading = false; });
  },
});

/* ============================================================
   Store
   ============================================================ */
const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    goals: goalsSlice.reducer,
    priorities: prioritiesSlice.reducer,
    todos: todosSlice.reducer,
    notes: notesSlice.reducer,
    hydration: hydrationSlice.reducer,
    reports: reportsSlice.reducer,
  },
});

export default store;
