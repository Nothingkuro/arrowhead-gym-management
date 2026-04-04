import { Check, Pencil, X } from 'lucide-react';
import { EquipmentCondition, type Equipment } from '../../types/equipment';
import ConditionBadge from './ConditionBadge';

interface EquipmentTableRowProps {
  equipment: Equipment;
  index: number;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onEdit: (equipment: Equipment) => void;
  isEditing?: boolean;
  editedCondition?: EquipmentCondition;
  onConditionChange?: (condition: EquipmentCondition) => void;
  onSaveCondition?: () => void;
  onCancelEdit?: () => void;
  onClick?: () => void;
}

export default function EquipmentTableRow({
  equipment,
  index,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onEdit,
  isEditing = false,
  editedCondition,
  onConditionChange,
  onSaveCondition,
  onCancelEdit,
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
        {isEditing ? (
          <select
            aria-label={`Condition for ${equipment.itemName}`}
            value={editedCondition ?? equipment.condition}
            onChange={(event) => onConditionChange?.(event.target.value as EquipmentCondition)}
            className="w-36 rounded-md border border-neutral-300 px-2 py-1.5 text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary"
          >
            <option value={EquipmentCondition.GOOD}>Good</option>
            <option value={EquipmentCondition.MAINTENANCE}>Maintenance</option>
            <option value={EquipmentCondition.BROKEN}>Broken</option>
          </select>
        ) : (
          <ConditionBadge
            condition={equipment.condition}
            variant="pill"
            className={isHovered ? 'ring-1 ring-secondary/20' : ''}
          />
        )}
      </td>

      <td className="px-4 sm:px-6 py-3">
        <div className="flex items-center justify-end gap-2">
          {isEditing ? (
            <>
              <button
                type="button"
                aria-label={`Save condition for ${equipment.itemName}`}
                title="Save condition"
                onClick={(event) => {
                  event.stopPropagation();
                  onSaveCondition?.();
                }}
                className="p-2 rounded-md border border-success/40 text-success hover:bg-success/10 transition-colors duration-150 cursor-pointer"
              >
                <Check size={16} />
              </button>
              <button
                type="button"
                aria-label={`Cancel editing condition for ${equipment.itemName}`}
                title="Cancel"
                onClick={(event) => {
                  event.stopPropagation();
                  onCancelEdit?.();
                }}
                className="p-2 rounded-md border border-neutral-300 text-secondary hover:bg-neutral-100 transition-colors duration-150 cursor-pointer"
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <button
              type="button"
              aria-label={`Edit condition for ${equipment.itemName}`}
              title="Edit condition"
              onClick={(event) => {
                event.stopPropagation();
                onEdit(equipment);
              }}
              className="p-2 rounded-md border border-neutral-300 text-secondary hover:bg-neutral-100 transition-colors duration-150 cursor-pointer"
            >
              <Pencil size={16} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
