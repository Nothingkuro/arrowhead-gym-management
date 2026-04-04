import { Pencil, Trash2 } from 'lucide-react';
import type { Equipment } from '../../types/equipment';
import ConditionBadge from './ConditionBadge';

interface EquipmentTableRowProps {
  equipment: Equipment;
  index: number;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onEdit: (equipment: Equipment) => void;
  onDelete: (equipment: Equipment) => void;
  onClick?: () => void;
}

export default function EquipmentTableRow({
  equipment,
  index,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onEdit,
  onDelete,
  onClick,
}: EquipmentTableRowProps) {
  const displayedItemName =
    equipment.itemName.length > 20
      ? `${equipment.itemName.slice(0, 20)}...`
      : equipment.itemName;

  const rowClassName = `
    border-b border-neutral-200 last:border-b-0 transition-all duration-200
    ${
      isHovered
        ? 'bg-warning'
        : index % 2 === 0
          ? 'bg-surface'
          : 'bg-surface-alt/50'
    }
    ${onClick ? 'cursor-pointer' : ''}
  `;

  return (
    <tr
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={rowClassName}
    >
      <td
        title={equipment.itemName}
        className={`px-4 sm:px-6 py-3 text-sm min-w-0 truncate ${isHovered ? 'text-secondary font-medium' : 'text-secondary'}`}
      >
        {displayedItemName}
      </td>

      <td className={`px-4 sm:px-6 py-3 text-sm text-center whitespace-nowrap ${isHovered ? 'text-secondary font-medium' : 'text-secondary'}`}>
        {equipment.quantity}
      </td>

      <td className="px-4 sm:px-6 py-3 text-right whitespace-nowrap">
        <ConditionBadge
          condition={equipment.condition}
          variant="pill"
          className={isHovered ? 'ring-1 ring-secondary/20' : ''}
        />
      </td>

      <td className="px-4 sm:px-6 py-3">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            aria-label={`Edit ${equipment.itemName}`}
            title="Edit"
            onClick={(event) => {
              event.stopPropagation();
              onEdit(equipment);
            }}
            className="p-2 rounded-md border border-neutral-300 text-secondary hover:bg-neutral-100 transition-colors duration-150 cursor-pointer"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            aria-label={`Delete ${equipment.itemName}`}
            title="Delete"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(equipment);
            }}
            className="p-2 rounded-md border border-danger/40 text-danger hover:bg-danger/10 transition-colors duration-150 cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
