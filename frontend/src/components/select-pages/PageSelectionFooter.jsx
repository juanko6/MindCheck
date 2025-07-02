import DashedButton from "../common/DashedButton";

export default function PageSelectionFooter({ onCancel, onContinue }) {
  return (
    <div className="flex gap-4 mt-8">

            <DashedButton
        withBorder={false}
        textColor="text-gray-900 dark:text-white"
        bgColor="bg-gray-500 hover:bg-gray-600"
        className="w-full md:w-auto"
        onClick={onCancel}
      >
        Regresar
      </DashedButton>

        <DashedButton
        withBorder={false}
        textColor="text-white"
        bgColor="bg-green-600 hover:bg-green-700"
        className="w-full md:w-auto"
        onClick={onContinue}
      >
        Crear Test
      </DashedButton>

    </div>
  );
}
