import { Button } from "@/components/ui/button";
import { AgencyDocumentsUpload } from "../documents";
import { Spinner } from "@/components/shared/spinner";
import { DocumentItem } from "@/types/agency/setting";

interface Props {
  isCreatingAgencyDocuments: boolean;
  onFormSubmit: React.FormEventHandler<HTMLFormElement>;
  onDelete: (doc: DocumentItem) => void;
  onError: Error | null;
  onLoading: boolean;
  refetchDocuments: () => Promise<void>;
}
const AgentDocumentDisplay = ({
  onFormSubmit,
  isCreatingAgencyDocuments,
  onDelete,
  onError,
  onLoading,
  refetchDocuments,
}: Props) => {
  return (
    <div>
      <form onSubmit={onFormSubmit}>
        <AgencyDocumentsUpload
          isUploading={isCreatingAgencyDocuments}
          onDelete={onDelete}
          onLoading={onLoading}
          onError={onError}
          refetchDocuments={refetchDocuments}
        />
        <div className="mt-4">
          <Button type="submit" variant="default" className="gap-2">
            {isCreatingAgencyDocuments ? <Spinner /> : "Submit Documents"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AgentDocumentDisplay;
