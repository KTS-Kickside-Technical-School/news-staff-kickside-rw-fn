import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getTeams } from '../../utils/requests/tournaments/teamsRequests';
import {
  getTournaments,
  getYears,
  saveTournamentSeason,
} from '../../utils/requests/tournaments/tournamentsRequests';
import { ITeam, ITournament, ITrYear } from '../../utils/types/Tournaments';
import TeamSelector from './match-center/tournament/TeamSelector';

type Status = 'Upcoming' | 'Ongoing' | 'Completed';

const REQUIRED = <span className="text-red-500">*</span>;

const SetupTournamentPerYear = () => {
  const [tournaments, setTournaments] = useState<ITournament[]>([]);
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [years, setYears] = useState<ITrYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    tournamentId: '',
    year: '',
    status: 'Upcoming' as Status,
    startDate: '',
    endDate: '',
    name: '',
    teamIds: [] as string[],
  });

  const [nameTouched, setNameTouched] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [trRes, tmRes, yrRes] = await Promise.all([
          getTournaments(),
          getTeams(),
          getYears(),
        ]);

        if (trRes?.status === 200) {
          const list = Array.isArray(trRes.data) ? trRes.data : [];

          setTournaments(
            [...list].sort((a, b) => a.name.localeCompare(b.name))
          );
        } else {
          throw new Error(trRes?.message || 'Failed to fetch tournaments');
        }

        if (tmRes?.status === 200) {
          const list = Array.isArray(tmRes.data) ? tmRes.data : [];

          setTeams([...list].sort((a, b) => a.name.localeCompare(b.name)));
        } else {
          throw new Error(tmRes?.message || 'Failed to fetch teams');
        }

        if (yrRes?.status === 200) {
          const list = Array.isArray(yrRes.data) ? yrRes.data : [];

          setYears([...list].sort((a, b) => a.name.localeCompare(b.name)));
        } else {
          throw new Error(yrRes?.message || 'Failed to fetch years');
        }
      } catch (err: any) {
        console.error(err);
        toast.error(err?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  useEffect(() => {
    if (nameTouched) return;

    const tr = tournaments.find((t) => t._id === form.tournamentId);

    const base = tr?.name?.trim() || '';

    const auto = [base].filter(Boolean).join(' ');
    setForm((prev) => ({ ...prev, name: auto }));
  }, [form.tournamentId, tournaments, nameTouched]);

  const minEndDate = form.startDate || undefined;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.tournamentId) errs.tournamentId = 'Tournament is required';
    if (!form.status) errs.status = 'Status is required';
    if (!form.startDate) errs.startDate = 'Start date is required';
    if (!form.endDate) errs.endDate = 'End date is required';
    if (
      form.startDate &&
      form.endDate &&
      new Date(form.endDate) < new Date(form.startDate)
    ) {
      errs.endDate = 'End date cannot be before start date';
    }

    if (!form.name.trim()) errs.name = 'Name is required';

    if (!form.teamIds.length) errs.teamIds = 'Select at least one team';
    else if (form.teamIds.length < 2)
      errs.teamIds = 'Select at least two teams';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      tournament: form.tournamentId,
      status: form.status,
      startDate: form.startDate,
      endDate: form.endDate,
      name: form.name.trim(),
      teams: form.teamIds,
      year: form.year,
    };

    try {
      setSaving(true);

      const res = await saveTournamentSeason(payload);
      if (res?.status === 201) {
        toast.success('Tournament season saved');
        setForm({
          tournamentId: '',
          year: '',
          status: 'Upcoming',
          startDate: '',
          endDate: '',
          name: '',
          teamIds: [],
        });
        setNameTouched(false);
        setErrors({});
        return;
      }

      toast.error(res.message || 'Error saving tournament season');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Failed to save tournament season');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Tournament Seasons</h2>
        <p className="text-gray-600">Loading data…</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Tournament Seasons</h2>

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col">
          <label htmlFor="tournamentId" className="mb-2 font-medium">
            Tournament {REQUIRED}
          </label>
          <select
            id="tournamentId"
            name="tournamentId"
            value={form.tournamentId}
            onChange={handleChange}
            className={`border rounded-lg px-3 py-2 focus:ring ${
              errors.tournamentId ? 'border-red-500' : 'focus:ring-blue-300'
            }`}
          >
            <option value="">Select</option>
            {tournaments.map((tr) => (
              <option key={tr._id} value={tr._id}>
                {tr.name}
              </option>
            ))}
          </select>
          {errors.tournamentId && (
            <span className="text-sm text-red-500">{errors.tournamentId}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="startDate" className="mb-2 font-medium">
            Season year {REQUIRED}
          </label>
          <select
            id="seasonYear"
            name="year"
            value={form.year}
            onChange={handleChange}
            className={`border rounded-lg px-3 py-2 focus:ring ${
              errors.year ? 'border-red-500' : 'focus:ring-blue-300'
            }`}
          >
            <option value="">Select season</option>
            {years.map((year) => (
              <option key={year._id} value={year._id}>
                {year.name}
              </option>
            ))}
          </select>
          {errors.year && (
            <span className="text-sm text-red-500">{errors.year}</span>
          )}
        </div>
        <div className="flex flex-col">
          <label htmlFor="status" className="mb-2 font-medium">
            Status {REQUIRED}
          </label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className={`border rounded-lg px-3 py-2 focus:ring ${
              errors.status ? 'border-red-500' : 'focus:ring-blue-300'
            }`}
          >
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
          {errors.status && (
            <span className="text-sm text-red-500">{errors.status}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="startDate" className="mb-2 font-medium">
            Start Date {REQUIRED}
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className={`border rounded-lg px-3 py-2 focus:ring ${
              errors.startDate ? 'border-red-500' : 'focus:ring-blue-300'
            }`}
          />
          {errors.startDate && (
            <span className="text-sm text-red-500">{errors.startDate}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="endDate" className="mb-2 font-medium">
            End Date {REQUIRED}
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            min={minEndDate}
            value={form.endDate}
            onChange={handleChange}
            className={`border rounded-lg px-3 py-2 focus:ring ${
              errors.endDate ? 'border-red-500' : 'focus:ring-blue-300'
            }`}
          />
          {errors.endDate && (
            <span className="text-sm text-red-500">{errors.endDate}</span>
          )}
        </div>

        <div className="flex flex-col md:col-span-2">
          <label htmlFor="name" className="mb-2 font-medium">
            Name {REQUIRED}{' '}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={(e) => {
              setNameTouched(true);
              handleChange(e);
            }}
            className={`border rounded-lg px-3 py-2 focus:ring ${
              errors.name ? 'border-red-500' : 'focus:ring-blue-300'
            }`}
            placeholder="e.g. Rwanda National League 2024/25"
          />
          {errors.name && (
            <span className="text-sm text-red-500">{errors.name}</span>
          )}
        </div>
        <TeamSelector
          teams={teams}
          form={form}
          setForm={setForm}
          errors={errors}
        />

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className={`px-4 py-2 rounded-lg text-white transition ${
              saving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {saving ? 'Saving…' : 'Save Season'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SetupTournamentPerYear;
