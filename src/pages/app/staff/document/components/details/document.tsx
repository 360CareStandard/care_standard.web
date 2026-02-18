import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DocumentType, StaffDocument } from "@/types/staff/document";
import { CloudUpload } from "lucide-react";

const documentTypes: DocumentType[] = [
  "ID",
  "Driving license",
  "Proof of address",
  "References",
  "DBS record",
];

interface Props {
  documentsByType: Partial<Record<DocumentType, StaffDocument>>;
  onAdd: (type: DocumentType) => void;
  onEdit: (doc: StaffDocument) => void;
  onDelete: (doc: StaffDocument) => void;
  isLoading: boolean;
}

export const DocumentList = ({
  documentsByType,
  onAdd,
  onEdit,
  onDelete,
  isLoading,
}: Props) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          {documentTypes.map((type) => {
            const existingDoc = documentsByType[type as DocumentType];

            return (
              <div key={type} className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  {existingDoc ? (
                    <svg
                      width={48}
                      height={48}
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx={24} cy={24} r={24} fill="#E7F6EC" />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M24 35.25C30.2132 35.25 35.25 30.2132 35.25 24C35.25 17.7868 30.2132 12.75 24 12.75C17.7868 12.75 12.75 17.7868 12.75 24C12.75 30.2132 17.7868 35.25 24 35.25ZM28.5943 22.4218C29.1034 21.9555 29.1381 21.1649 28.6718 20.6557C28.2055 20.1466 27.4149 20.1119 26.9057 20.5782L22.2907 24.805L21.0943 23.7092C20.5852 23.243 19.7945 23.2777 19.3282 23.7868C18.8619 24.2959 18.8966 25.0866 19.4057 25.5529L21.4464 27.4218C21.9242 27.8594 22.6571 27.8594 23.1349 27.4218L28.5943 22.4218Z"
                        fill="#0F973D"
                      />
                    </svg>
                  ) : (
                    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-foreground/5">
                      <CloudUpload className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-sm">{type}</h4>

                    {existingDoc ? (
                      <p className="text-xs text-green-600">
                        Uploaded
                        {/* {existingDoc.expired && " • Expired"} */}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG, PDF • Max 2MB
                      </p>
                    )}
                  </div>
                </div>

                {isLoading ? (
                  <Spinner size="lg" />
                ) : !existingDoc ? (
                  <Button
                    variant="outline"
                    onClick={() => onAdd(type as DocumentType)}
                  >
                    Upload
                  </Button>
                ) : (
                  <div className="flex   gap-6">
                    <button
                      className="text-sm"
                      onClick={() => onDelete(existingDoc)}
                    >
                      <svg
                        width={28}
                        height={28}
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.0841 2.04102C10.5992 2.04102 10.1648 2.341 9.99305 2.79451L9.72519 3.50183C9.15098 3.44446 8.62193 3.38719 8.19366 3.33911C7.87352 3.30316 7.61034 3.27242 7.42754 3.2507L7.21666 3.22539L7.14505 3.21664C6.50561 3.13746 5.92213 3.59153 5.84295 4.23097C5.76376 4.87042 6.21795 5.45299 6.85739 5.53217L6.93532 5.5417L7.15229 5.56774C7.33936 5.58997 7.60754 5.62129 7.9333 5.65787C8.58426 5.73096 9.46777 5.82531 10.3947 5.90991C11.6451 6.02403 13.0158 6.12435 14.0008 6.12435C14.9858 6.12435 16.3564 6.02403 17.6068 5.90991C18.5338 5.82531 19.4173 5.73096 20.0682 5.65787C20.394 5.62129 20.6622 5.58997 20.8493 5.56774L21.0662 5.5417L21.144 5.53219C21.7834 5.453 22.2378 4.87042 22.1586 4.23097C22.0794 3.59153 21.4969 3.13735 20.8574 3.21652L20.7849 3.22539L20.574 3.2507C20.3912 3.27242 20.128 3.30316 19.8079 3.33911C19.3796 3.38719 18.8506 3.44446 18.2764 3.50183L18.0085 2.79451C17.8368 2.341 17.4024 2.04102 16.9174 2.04102H11.0841Z"
                          fill="#D42620"
                        />
                        <path
                          d="M12.8341 13.7077C12.8341 13.0633 12.3118 12.541 11.6674 12.541C11.0231 12.541 10.5008 13.0633 10.5008 13.7077V19.541C10.5008 20.1853 11.0231 20.7077 11.6674 20.7077C12.3118 20.7077 12.8341 20.1853 12.8341 19.541V13.7077Z"
                          fill="#D42620"
                        />
                        <path
                          d="M16.3341 12.541C16.9784 12.541 17.5008 13.0633 17.5008 13.7077V19.541C17.5008 20.1853 16.9784 20.7077 16.3341 20.7077C15.6898 20.7077 15.1674 20.1853 15.1674 19.541V13.7077C15.1674 13.0633 15.6898 12.541 16.3341 12.541Z"
                          fill="#D42620"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M22.062 9.39167C22.1678 7.91144 20.8916 6.72475 19.4413 6.89236C17.9572 7.06387 15.6672 7.29102 14.0008 7.29102C12.3344 7.29102 10.0443 7.06387 8.56026 6.89236C7.10995 6.72475 5.83378 7.91144 5.93951 9.39167L6.93904 23.385C7.0148 24.4457 7.80491 25.3426 8.88919 25.5057C10.0519 25.6805 12.1854 25.9598 14.0021 25.9577C15.7965 25.9556 17.9387 25.6775 19.1065 25.5043C20.1927 25.3431 20.9867 24.4457 21.0627 23.3818L22.062 9.39167ZM19.7092 9.21027C19.7132 9.2098 19.7163 9.21008 19.7163 9.21008L19.7194 9.21078C19.722 9.21168 19.726 9.21381 19.7301 9.21762C19.7327 9.22014 19.7347 9.22322 19.7347 9.22322L19.7346 9.22542L18.7364 23.2003C17.5806 23.3711 15.5997 23.6225 13.9994 23.6243C12.3818 23.6262 10.4131 23.3745 9.26529 23.2026L8.26692 9.22542L8.26683 9.22322C8.26683 9.22322 8.26881 9.22014 8.27147 9.21762C8.2755 9.21381 8.27956 9.21168 8.28216 9.21078L8.28524 9.21008C8.28524 9.21008 8.28834 9.2098 8.29239 9.21027C9.77906 9.38208 12.1871 9.62435 14.0008 9.62435C15.8144 9.62435 18.2225 9.38208 19.7092 9.21027Z"
                          fill="#D42620"
                        />
                      </svg>
                    </button>
                    <button
                      className="text-sm"
                      onClick={() => onEdit(existingDoc)}
                    >
                      <svg
                        width={28}
                        height={28}
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.17578 6.02148H20.3225C22.2591 6.02148 23.8225 7.58482 23.8225 9.52148V13.3948"
                          stroke="#191D31"
                          strokeWidth="1.5"
                          strokeMiterlimit={10}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.86245 2.33398L4.17578 6.02062L7.86245 9.70733"
                          stroke="#191D31"
                          strokeWidth="1.5"
                          strokeMiterlimit={10}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M23.8225 21.9808H7.67578C5.73911 21.9808 4.17578 20.4174 4.17578 18.4808V14.6074"
                          stroke="#191D31"
                          strokeWidth="1.5"
                          strokeMiterlimit={10}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M20.1367 25.6683L23.8234 21.9816L20.1367 18.2949"
                          stroke="#191D31"
                          strokeWidth="1.5"
                          strokeMiterlimit={10}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};
