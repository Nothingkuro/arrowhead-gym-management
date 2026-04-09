interface SubmitPaymentButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  label?: string;
}

export default function SubmitPaymentButton({
  onClick,
  disabled = false,
  label = 'Submit',
}: SubmitPaymentButtonProps) {
  return (
    <div className="mt-4 flex justify-center">
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="
          px-10 py-2.5 bg-primary-dark text-text-light text-sm font-semibold
          rounded-full shadow-md shadow-primary/20
          hover:bg-primary hover:shadow-lg hover:shadow-primary/30
          active:scale-[0.97] transition-all duration-200 cursor-pointer
          disabled:cursor-not-allowed disabled:opacity-70
        "
      >
        {label}
      </button>
    </div>
  );
}
