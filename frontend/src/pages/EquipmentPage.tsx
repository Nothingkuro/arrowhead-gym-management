import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import FilterDropdown from '../components/common/FilterDropdown';
import AddEquipmentModal, { type EquipmentFormData } from '../components/equipment/AddEquipmentModal';
import EquipmentTableRow from '../components/equipment/EquipmentTableRow';
import { EquipmentCondition, type Equipment } from '../types/equipment';

type EquipmentFilter = 'ALL' | EquipmentCondition;

type MockPageResponse = {
  items: Equipment[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const filterOptions: Array<{ label: string; value: EquipmentFilter }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Good', value: EquipmentCondition.GOOD },
  { label: 'Maintenance', value: EquipmentCondition.MAINTENANCE },
  { label: 'Broken', value: EquipmentCondition.BROKEN },
];

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 150;

const seedEquipment: Equipment[] = [
  {
    id: 'EQ-001',
    itemName: 'Olympic Barbell',
    quantity: 6,
    condition: EquipmentCondition.GOOD,
    lastChecked: '2026-04-01T09:00:00.000Z',
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-04-01T09:00:00.000Z',
  },
  {
    id: 'EQ-002',
    itemName: 'Adjustable Bench',
    quantity: 4,
    condition: EquipmentCondition.MAINTENANCE,
    lastChecked: '2026-04-02T10:30:00.000Z',
    createdAt: '2026-01-15T08:00:00.000Z',
    updatedAt: '2026-04-02T10:30:00.000Z',
  },
  {
    id: 'EQ-003',
    itemName: 'Treadmill Pro X',
    quantity: 3,
    condition: EquipmentCondition.BROKEN,
    lastChecked: '2026-04-02T14:00:00.000Z',
    createdAt: '2026-02-01T08:00:00.000Z',
    updatedAt: '2026-04-02T14:00:00.000Z',
  },
  {
    id: 'EQ-004',
    itemName: 'Yoga Mats',
    quantity: 25,
    condition: EquipmentCondition.GOOD,
    lastChecked: '2026-03-30T07:45:00.000Z',
    createdAt: '2026-02-10T08:00:00.000Z',
    updatedAt: '2026-03-30T07:45:00.000Z',
  },
  {
    id: 'EQ-005',
    itemName: 'Cable Machine',
    quantity: 2,
    condition: EquipmentCondition.MAINTENANCE,
    lastChecked: '2026-03-28T16:20:00.000Z',
    createdAt: '2026-01-20T08:00:00.000Z',
    updatedAt: '2026-03-28T16:20:00.000Z',
  },
  {
    id: 'EQ-006',
    itemName: 'Kettlebell Set',
    quantity: 12,
    condition: EquipmentCondition.GOOD,
    lastChecked: '2026-03-27T12:15:00.000Z',
    createdAt: '2026-02-04T08:00:00.000Z',
    updatedAt: '2026-03-27T12:15:00.000Z',
  },
  {
    id: 'EQ-007',
    itemName: 'Leg Press Machine',
    quantity: 1,
    condition: EquipmentCondition.BROKEN,
    lastChecked: '2026-03-29T11:05:00.000Z',
    createdAt: '2026-01-26T08:00:00.000Z',
    updatedAt: '2026-03-29T11:05:00.000Z',
  },
  {
    id: 'EQ-008',
    itemName: 'Medicine Ball Rack',
    quantity: 2,
    condition: EquipmentCondition.GOOD,
    lastChecked: '2026-04-03T09:20:00.000Z',
    createdAt: '2026-03-01T08:00:00.000Z',
    updatedAt: '2026-04-03T09:20:00.000Z',
  },
];

function filterAndPaginateEquipment(
  source: Equipment[],
  query: string,
  filter: EquipmentFilter,
  page: number,
  pageSize: number,
): MockPageResponse {
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = source.filter((equipment) => {
    const matchesQuery =
      !normalizedQuery ||
      equipment.itemName.toLowerCase().includes(normalizedQuery) ||
      equipment.id.toLowerCase().includes(normalizedQuery);

    const matchesFilter = filter === 'ALL' || equipment.condition === filter;

    return matchesQuery && matchesFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page: safePage,
    pageSize,
    totalPages,
  };
}

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

interface EquipmentPageProps {
  equipment?: Equipment[];
  initialSearchQuery?: string;
  initialFilter?: EquipmentFilter;
  initialFilterOpen?: boolean;
  initialAddModalOpen?: boolean;
  forceLoading?: boolean;
  forcedErrorMessage?: string | null;
}

export default function EquipmentPage({
  equipment,
  initialSearchQuery = '',
  initialFilter = 'ALL',
  initialFilterOpen = false,
  initialAddModalOpen = false,
  forceLoading = false,
  forcedErrorMessage = null,
}: EquipmentPageProps) {
  const [inventory, setInventory] = useState<Equipment[]>(equipment ?? seedEquipment);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(initialSearchQuery);
  const [filterOpen, setFilterOpen] = useState(initialFilterOpen);
  const [activeFilter, setActiveFilter] = useState<EquipmentFilter>(initialFilter);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEquipment, setTotalEquipment] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(initialAddModalOpen);
  const [editingEquipmentId, setEditingEquipmentId] = useState<string | null>(null);
  const [isLoadingEquipment, setIsLoadingEquipment] = useState(true);
  const [equipmentLoadError, setEquipmentLoadError] = useState<string | null>(null);
  const [isSubmittingEquipment, setIsSubmittingEquipment] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [refreshNonce, setRefreshNonce] = useState(0);

  useEffect(() => {
    if (equipment) {
      setInventory(equipment);
    }
  }, [equipment]);

  const editingEquipment = useMemo(
    () => inventory.find((equipment) => equipment.id === editingEquipmentId) ?? null,
    [editingEquipmentId, inventory],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    let isCancelled = false;

    if (forceLoading) {
      setIsLoadingEquipment(true);
      setEquipmentLoadError(null);
      return () => {
        isCancelled = true;
      };
    }

    if (forcedErrorMessage) {
      setIsLoadingEquipment(false);
      setEquipmentLoadError(forcedErrorMessage);
      setEquipmentList([]);
      setTotalEquipment(0);
      setTotalPages(1);
      return () => {
        isCancelled = true;
      };
    }

    setIsLoadingEquipment(true);
    setEquipmentLoadError(null);

    const timeoutId = window.setTimeout(() => {
      try {
        const response = filterAndPaginateEquipment(
          inventory,
          debouncedSearchQuery,
          activeFilter,
          currentPage,
          PAGE_SIZE,
        );

        if (isCancelled) {
          return;
        }

        setEquipmentList(response.items);
        setTotalEquipment(response.total);
        setTotalPages(response.totalPages);

        if (response.page !== currentPage) {
          setCurrentPage(response.page);
        }
      } catch (error: unknown) {
        if (isCancelled) {
          return;
        }

        const message =
          error instanceof Error ? error.message : 'Failed to load equipment inventory';
        setEquipmentLoadError(message);
      } finally {
        if (!isCancelled) {
          setIsLoadingEquipment(false);
        }
      }
    }, 120);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [
    inventory,
    debouncedSearchQuery,
    activeFilter,
    currentPage,
    refreshNonce,
    forceLoading,
    forcedErrorMessage,
  ]);

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingEquipmentId(null);
    setFormError(null);
  };

  const handleOpenAdd = () => {
    setEditingEquipmentId(null);
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (equipment: Equipment) => {
    setEditingEquipmentId(equipment.id);
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const handleDelete = (equipment: Equipment) => {
    const shouldDelete = window.confirm(`Delete ${equipment.itemName}?`);

    if (!shouldDelete) {
      return;
    }

    setInventory((currentItems) => currentItems.filter((item) => item.id !== equipment.id));
    setRefreshNonce((prev) => prev + 1);
  };

  const handleSubmit = async (data: EquipmentFormData) => {
    if (isSubmittingEquipment) {
      return;
    }

    const normalizedName = data.itemName.trim();

    if (!normalizedName) {
      setFormError('Equipment name is required.');
      return;
    }

    if (!Number.isFinite(data.quantity) || data.quantity < 0) {
      setFormError('Quantity must be 0 or greater.');
      return;
    }

    setIsSubmittingEquipment(true);
    setFormError(null);

    try {
      await new Promise<void>((resolve) => {
        window.setTimeout(() => resolve(), 180);
      });

      const nowIso = new Date().toISOString();

      if (editingEquipmentId) {
        setInventory((currentItems) =>
          currentItems.map((item) =>
            item.id === editingEquipmentId
              ? {
                  ...item,
                  itemName: normalizedName,
                  quantity: data.quantity,
                  condition: data.condition,
                  lastChecked: nowIso,
                  updatedAt: nowIso,
                }
              : item,
          ),
        );
      } else {
        const createdEquipment: Equipment = {
          id: `EQ-${Date.now()}`,
          itemName: normalizedName,
          quantity: data.quantity,
          condition: data.condition,
          lastChecked: nowIso,
          createdAt: nowIso,
          updatedAt: nowIso,
        };

        setInventory((currentItems) => [createdEquipment, ...currentItems]);
        setCurrentPage(1);
      }

      setRefreshNonce((prev) => prev + 1);
      closeModal();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to save equipment item';
      setFormError(message);
    } finally {
      setIsSubmittingEquipment(false);
    }
  };

  return (
    <div className="relative min-h-full">
      <div className="flex items-center justify-center gap-3 mb-8">
        <h1 className="text-primary text-3xl sm:text-4xl font-semibold">
          Equipment Inventory
        </h1>
      </div>

      <div className="flex items-center gap-3 mb-6 max-w-2xl mx-auto">
        <SearchBar
          value={searchQuery}
          onChange={(value) => {
            setSearchQuery(value);
            setCurrentPage(1);
          }}
          placeholder="Search equipment..."
          className="flex-1"
          inputClassName="bg-surface border-neutral-300 text-secondary placeholder:text-neutral-400"
        />

        <FilterDropdown
          label="Filter"
          options={filterOptions}
          activeOption={activeFilter}
          isOpen={filterOpen}
          onToggle={() => setFilterOpen((prev) => !prev)}
          onSelect={(option) => {
            setActiveFilter(option as EquipmentFilter);
            setCurrentPage(1);
            setFilterOpen(false);
          }}
        />
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="border border-neutral-300 rounded-lg overflow-hidden bg-surface">
          <div className="w-full max-h-96 overflow-auto">
            <table className="w-full min-w-160 border-collapse">
              <thead className="bg-surface-alt border-b border-neutral-300">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold tracking-wide text-neutral-600 uppercase">
                    Item Name
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-center text-xs font-semibold tracking-wide text-neutral-600 uppercase">
                    Qty
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold tracking-wide text-neutral-600 uppercase">
                    Condition
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold tracking-wide text-neutral-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoadingEquipment ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-neutral-400 text-sm">
                      Loading equipment...
                    </td>
                  </tr>
                ) : equipmentLoadError ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-red-600 text-sm">
                      {equipmentLoadError}
                    </td>
                  </tr>
                ) : equipmentList.length > 0 ? (
                  equipmentList.map((equipment, index) => (
                    <EquipmentTableRow
                      key={equipment.id}
                      equipment={equipment}
                      index={index}
                      isHovered={hoveredRow === index}
                      onMouseEnter={() => setHoveredRow(index)}
                      onMouseLeave={() => setHoveredRow(null)}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-neutral-400 text-sm">
                      No equipment found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {!isLoadingEquipment && !equipmentLoadError && (
          <div className="mt-4 flex items-center justify-between text-sm text-secondary">
            <span>
              Showing page {currentPage} of {totalPages} ({totalEquipment} item{totalEquipment === 1 ? '' : 's'})
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage <= 1}
                className="px-3 py-1.5 rounded-md border border-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100 transition-colors"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage >= totalPages}
                className="px-3 py-1.5 rounded-md border border-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-20">
        <button
          onClick={handleOpenAdd}
          className="
            flex items-center gap-2 px-5 py-3 bg-primary text-text-light
            rounded-full shadow-lg shadow-primary/30
            hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/40
            active:scale-95 transition-all duration-200 cursor-pointer
            text-sm font-semibold
          "
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Equipment</span>
        </button>
      </div>

      <AddEquipmentModal
        isOpen={isAddModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        initialData={
          editingEquipment
            ? {
                itemName: editingEquipment.itemName,
                quantity: editingEquipment.quantity,
                condition: editingEquipment.condition,
              }
            : undefined
        }
        isSubmitting={isSubmittingEquipment}
        errorMessage={formError}
        title={editingEquipment ? 'Edit Equipment' : 'Add Equipment'}
        submitLabel={editingEquipment ? 'Save Changes' : 'Submit'}
        submittingLabel={editingEquipment ? 'Saving...' : 'Submitting...'}
      />

      {!isLoadingEquipment && equipmentList.length > 0 && (
        <p className="mt-6 text-center text-xs text-neutral-500">
          Last updated: {formatDate(equipmentList[0].updatedAt)}
        </p>
      )}
    </div>
  );
}
