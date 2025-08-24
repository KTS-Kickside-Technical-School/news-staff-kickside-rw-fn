import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { ITeam } from '../../../../utils/types/Tournaments';

const REQUIRED = <span className="text-red-500">*</span>;

const TeamSelector = ({ teams, form, setForm, errors }: any) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTeams = teams
    .filter((tm: ITeam): tm is ITeam & { _id: string } => !!tm._id)
    .filter((tm: ITeam) =>
      (tm.name + ' ' + (tm.country?.name || ''))
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a: any, b: any) =>
      (a.country?.name || '').localeCompare(b.country?.name || '')
    );

  return (
    <div className="flex flex-col md:col-span-2">
      <label htmlFor="teamIds" className="mb-2 font-medium">
        Teams {REQUIRED}
      </label>

      <input
        type="text"
        placeholder="Search teams..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3 p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[20rem] overflow-y-auto border rounded-lg p-3">
        {filteredTeams.length > 0 ? (
          filteredTeams.map((tm: ITeam) => (
            <label
              key={tm._id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                value={tm._id}
                checked={form.teamIds.includes(tm._id)}
                onChange={(e) => {
                  const id = tm._id;
                  setForm((prev: any) => ({
                    ...prev,
                    teamIds: e.target.checked
                      ? [...prev.teamIds, id]
                      : prev.teamIds.filter((x: string) => x !== id),
                  }));
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>
                {tm.name} {tm.country?.name ? `(${tm.country.name})` : ''}
              </span>
            </label>
          ))
        ) : (
          <span className="text-gray-400 text-sm col-span-2">
            No teams match your search
          </span>
        )}
      </div>

      <div className="border rounded-lg p-3 mt-3">
        <div className="text-sm text-gray-600 mb-2">
          Selected: {form.teamIds.length}
        </div>
        <div className="flex flex-wrap gap-2">
          {form.teamIds.map((id: string) => {
            const t = teams.find((x: ITeam) => x._id === id);
            return (
              <span
                key={id}
                className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm px-2 py-1 rounded-full"
              >
                {t?.name || id}
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev: any) => ({
                      ...prev,
                      teamIds: prev.teamIds.filter((x: string) => x !== id),
                    }))
                  }
                  className="hover:text-red-600"
                  title="Remove"
                >
                  <FaTimes />
                </button>
              </span>
            );
          })}
          {!form.teamIds.length && (
            <span className="text-gray-400 text-sm">No teams selected</span>
          )}
        </div>
      </div>

      {errors.teamIds && (
        <span className="text-sm text-red-500">{errors.teamIds}</span>
      )}
    </div>
  );
};

export default TeamSelector;
