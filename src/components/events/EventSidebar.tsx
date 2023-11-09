import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from '@radix-ui/react-radio-group';
import {
  ClubSearchBar,
  EventClubSearchBar,
  EventSearchBar,
} from '../SearchBar';
import { type Dispatch, type SetStateAction } from 'react';
import { type SelectClub } from '@src/server/db/models';
import {
  Popover,
  PopoverPortal,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import DatePopover from './DatePopover';
import { type DateRange } from 'react-day-picker';

export const filters = [
  'Upcoming Events',
  'Last weeks events',
  'Last month events',
] as const;
const order = [
  'soon',
  'later',
  'shortest duration',
  'longest duration',
] as const;
const types = ['In-Person', 'Virtual', 'Multi-Day', 'Hybrid'] as const;
export type filterState = {
  filter: (typeof filters)[number] | 'pick';
  date?: DateRange;
  club: Array<SelectClub>;
  order: (typeof order)[number];
  types: (typeof types)[number][];
};
type EventSidebarProps = {
  filterState: filterState;
  setFilterState: Dispatch<SetStateAction<filterState>>;
};

const EventSidebar = ({ filterState, setFilterState }: EventSidebarProps) => {
  return (
    <div className="flex w-64 flex-col space-y-10">
      <div className="flex flex-col space-y-7.5">
        <h2 className="text-sm font-bold text-slate-500">Filters</h2>
        <RadioGroup
          className="space-y-2.5"
          value={filterState.filter}
          onValueChange={(value) => {
            setFilterState((old) => {
              return {
                filter: value as (typeof filters)[number],
                club: old.club,
                order: old.order,
                types: old.types,
              };
            });
          }}
        >
          {filters.map((value) => (
            <RadioGroupItem
              key={value}
              value={value}
              className="h-10 w-64 rounded-lg bg-white py-2.5 drop-shadow-sm"
            >
              <div className="ml-4 mr-10 flex h-min flex-row items-center space-x-2.5 text-center">
                <div className="flex h-5 w-5 items-center justify-center rounded-xl border-2 border-gray-50 p-0.5 shadow-sm ">
                  <RadioGroupIndicator className="h-2.5 w-2.5 rounded-full bg-blue-primary" />
                </div>
                <p className="w-full text-xs font-extrabold text-slate-500">
                  {value}
                </p>
              </div>
            </RadioGroupItem>
          ))}
          <RadioGroupItem
            value="pick"
            className="h-10 w-64 rounded-lg bg-white py-2.5 drop-shadow-sm"
          >
            <Popover defaultOpen={false}>
              <PopoverTrigger asChild>
                <div className="relative ml-4 mr-10 flex h-min flex-row items-center space-x-2.5 text-center">
                  <div className="flex h-5 w-5 items-center justify-center rounded-xl border-2 border-gray-50 p-0.5 shadow-sm ">
                    <RadioGroupIndicator className="h-2.5 w-2.5 rounded-full bg-blue-primary" />
                  </div>
                  <p className="w-full text-xs font-extrabold text-slate-500">
                    Pick a date range
                  </p>
                </div>
              </PopoverTrigger>
              <PopoverPortal>
                <DatePopover
                  range={filterState.date}
                  setRange={(val) => {
                    setFilterState((old) => {
                      return {
                        filter: old.filter,
                        club: old.club,
                        date: val,
                        order: old.order,
                        types: old.types,
                      };
                    });
                  }}
                />
              </PopoverPortal>
            </Popover>
          </RadioGroupItem>
        </RadioGroup>
      </div>
      <div className="flex flex-col space-y-7.5">
        <h2 className="text-sm font-bold text-slate-500">Search for Club</h2>
        <EventClubSearchBar
          addClub={(val) => {
            setFilterState((old) => {
              if (!old.club.includes(val)) {
                return {
                  filter: old.filter,
                  club: [...old.club, val],
                  order: old.order,
                  types: old.types,
                };
              }
              return old;
            });
          }}
        />
        <div className="space-y-2 p-1">
          {filterState.club.map((value) => (
            <div
              className="relative flex w-full flex-row items-center justify-center rounded-lg bg-white py-2.5"
              key={value.id}
            >
              <span className="text-center text-xs font-extrabold text-slate-500">
                {value.name}
              </span>
              <button
                className="absolute right-4"
                type="button"
                title="remove club"
                onClick={() => {
                  setFilterState((old) => {
                    const clubs = old.club.filter((val) => val.id != value.id);
                    return {
                      filter: old.filter,
                      club: clubs,
                      order: old.order,
                      types: old.types,
                    };
                  });
                }}
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col space-y-7.5">
        <h2 className="text-sm font-bold text-slate-500">Order</h2>
        <RadioGroup
          className="flex flex-col space-y-2.5"
          value={filterState.order}
          onValueChange={(value) => {
            setFilterState((old) => {
              return {
                filter: old.filter,
                club: old.club,
                order: value as (typeof order)[number],
                types: old.types,
              };
            });
          }}
        >
          {order.map((value) => (
            <RadioGroupItem
              key={value}
              value={value}
              className="h-10 w-64 rounded-lg bg-white py-2.5 drop-shadow-sm"
            >
              <div className="ml-4 mr-10 flex h-min flex-row items-center space-x-2.5 text-center">
                <div className="flex h-5 w-5 items-center justify-center rounded-xl border-2 border-gray-50 p-0.5 shadow-sm ">
                  <RadioGroupIndicator className="h-2.5 w-2.5 rounded-full bg-blue-primary" />
                </div>
                <p className="w-full text-xs font-extrabold text-slate-500">
                  {value}
                </p>
              </div>
            </RadioGroupItem>
          ))}
        </RadioGroup>
      </div>
      <div className="flex hidden flex-col space-y-7.5">
        <h2 className="text-sm font-bold text-slate-500">Event Types</h2>
        <div className="flex flex-col space-y-2.5">
          {types.map((value) => (
            <div
              key={value}
              className="h-10 w-64 rounded-lg bg-white py-2.5 drop-shadow-sm"
            >
              <label>
                <div className="ml-4 mr-10 flex flex-row items-center space-x-2.5 text-center">
                  <input type="checkbox" id={`filter-${value}`} name="filter" />
                  <p className="w-full text-xs font-extrabold text-slate-500">
                    {value}
                  </p>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default EventSidebar;