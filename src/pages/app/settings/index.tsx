import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Main } from "@/layouts/main";
import { useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AgencyDocumentFormData,
  agencyDocumentSchema,
  AgencyLogoFormData,
  agencyLogoSchema,
} from "@/pages/schemas/agency";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import AgencyLogoForm from "./components/logo";
import {
  useAgencyDocument,
  useAgencyLogo,
  useDeleteAgencyDocument,
  useUpdateAgencyLogo,
  useUploadAgencyDocument,
  useUploadAgencyLogo,
} from "@/hooks/agency/settings";
import toast from "react-hot-toast";
import { handleFormApiError } from "@/lib/handle-form-error";
import AgentDocumentDisplay from "./components/ui/document-display";
import { DocumentItem } from "@/types/agency/setting";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

const TAB_KEYS = ["logo", "documents"] as const;
type TabKey = (typeof TAB_KEYS)[number];

const logoResolver = zodResolver(
  agencyLogoSchema,
) as unknown as Resolver<AgencyLogoFormData>;
const documentResolver = zodResolver(
  agencyDocumentSchema,
) as unknown as Resolver<AgencyDocumentFormData>;

const CompanySettings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pendingDeleteDoc, setPendingDeleteDoc] = React.useState<{
    id: string;
    name?: string;
  } | null>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const { mutateAsync: uploadAgencyLogo, isPending: isCreatingAgencyLogo } =
    useUploadAgencyLogo();
  const { mutateAsync: updateAgencyLogo, isPending: isUpdatingAgencyLogo } =
    useUpdateAgencyLogo();
  const {
    mutateAsync: uploadAgencyDocuments,
    isPending: isCreatingAgencyDocuments,
  } = useUploadAgencyDocument();
  const {
    data: agencyDocumentsFromAPI,
    isLoading: agencyDocumentsLoading,
    error: agencyDocumentsError,
    refetch,
  } = useAgencyDocument();
  const deleteAgencyDocument = useDeleteAgencyDocument();
  const [removeServerLogo, setRemoveServerLogo] = React.useState(false);

  const { data: agencyLogo } = useAgencyLogo();
  const openDeleteDialog = (doc: DocumentItem) => {
    setPendingDeleteDoc({ id: doc.id, name: doc.name });
    setConfirmOpen(true);
  };
  const performDelete = async () => {
    if (!pendingDeleteDoc) return;

    try {
      await deleteAgencyDocument.mutateAsync(pendingDeleteDoc.id);
      toast.success("Document deleted");
      await refetch();
      setConfirmOpen(false);
      setPendingDeleteDoc(null);
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete document");
    } finally {
      setPendingDeleteDoc(null);
    }
  };

  const refetchDocuments = async () => {
    await refetch();
  };
  const raw = searchParams.get("tab") ?? "logo";
  const currentTab: TabKey = (TAB_KEYS as readonly string[]).includes(raw)
    ? (raw as TabKey)
    : "logo";
  const onTabChange = (next: string) => {
    setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);
      sp.set("tab", next);
      return sp;
    });
  };
  const logoMethods = useForm<AgencyLogoFormData>({
    resolver: logoResolver,
    defaultValues: {
      logo: undefined,
    },
    mode: "onTouched",
    reValidateMode: "onChange",
    shouldUnregister: false,
  });
  const documentMethods = useForm<AgencyDocumentFormData>({
    resolver: documentResolver,
    mode: "onChange",
    defaultValues: {
      documents: [],
      existingDocuments: [], // 👈 important
    },
  });

  useEffect(() => {
    if (agencyDocumentsFromAPI) {
      documentMethods.setValue(
        "existingDocuments",
        agencyDocumentsFromAPI.documents,
      );
    }
  }, [agencyDocumentsFromAPI]);
  React.useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams(
        (prev) => {
          const sp = new URLSearchParams(prev);
          sp.set("tab", "logo");
          return sp;
        },
        { replace: true },
      );
    }
  }, [searchParams, setSearchParams]);

  const onValidSubmit = async (vals: AgencyLogoFormData) => {
    const payload = {
      ...vals,
    };
    if (!payload.logo) {
      toast.error("Please select a logo to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("logo", payload.logo);

    try {
      if (removeServerLogo && !payload.logo) {
        await updateAgencyLogo(formData);
        toast.success("Logo updated successfully");
      } else if (agencyLogo?.logo) {
        await updateAgencyLogo(formData);
        toast.success("Logo uploaded successfully");
      } else {
        await uploadAgencyLogo(formData);
        toast.success("Logo uploaded successfully");
      }

      logoMethods.reset();
      setRemoveServerLogo(false);
    } catch (err) {
      handleFormApiError(err, logoMethods.setError, "Failed to save logo");
    }
  };

  const onValidDocumentSubmit = async (vals: AgencyDocumentFormData) => {
    try {
      if (!vals.documents.length) {
        toast.error("Please select a document");
        return;
      }

      const formData = new FormData();

      vals.documents.forEach((file) => {
        formData.append("documents", file);
      });

      await uploadAgencyDocuments(formData);

      toast.success("Documents uploaded successfully");

      documentMethods.reset({
        documents: [],
        existingDocuments: documentMethods.getValues("existingDocuments"),
      });
    } catch (err) {
      handleFormApiError(
        err,
        documentMethods.setError,
        "Failed to upload documents",
      );
    }
  };

  const submitLogo = logoMethods.handleSubmit(onValidSubmit);
  const submitDocuments = documentMethods.handleSubmit(onValidDocumentSubmit);

  return (
    <Main className=" w-[933px] mx-auto">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-semibold">Company Setting</h1>
          {/* <p className="mt-1 text-xs text-muted-foreground">
           
            </p> */}
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={onTabChange} className="mt-8">
        <TabsList className="justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="logo"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Agency Logo
          </TabsTrigger>

          <TabsTrigger
            value="documents"
            className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Documents
          </TabsTrigger>
        </TabsList>
        <TabsContent value="logo" className="mt-4">
          <FormProvider {...logoMethods}>
            <AgencyLogoForm
              removeServerLogo={removeServerLogo}
              setRemoveServerLogo={setRemoveServerLogo}
              onFormSubmit={submitLogo}
              isLoading={isCreatingAgencyLogo}
              isUpdating={isUpdatingAgencyLogo}
              logourl={agencyLogo?.logo ?? ""}
            />
          </FormProvider>
        </TabsContent>
        <TabsContent value="documents" className="mt-4">
          <FormProvider {...documentMethods}>
            <AgentDocumentDisplay
              onFormSubmit={submitDocuments}
              isCreatingAgencyDocuments={isCreatingAgencyDocuments}
              onDelete={(doc) => openDeleteDialog(doc)}
              onLoading={agencyDocumentsLoading}
              onError={agencyDocumentsError}
              refetchDocuments={refetchDocuments}
            />
          </FormProvider>
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        handleConfirm={performDelete}
        disabled={deleteAgencyDocument.isPending}
        isLoading={deleteAgencyDocument.isPending}
        className="!bg-[#F9FAFB] "
        title={
          <div>
            <span className="text-sm">Delete document?</span>
          </div>
        }
        desc={
          <div className="space-y-6">
            <div className="rounded-lg border bg-white p-4 space-y-3">
              <ul className="space-y-2">
                This document will be permanently removed. This action cannot be
                undone.
              </ul>
            </div>
          </div>
        }
        cancelBtnText="Keep document"
        confirmText="Delete"
        destructive
      />
    </Main>
  );
};

export default CompanySettings;
