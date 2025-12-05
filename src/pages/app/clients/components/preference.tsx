import { Card, CardContent } from "@/components/ui/card";
import { InfoRow } from "../client/components/info-row";
// import dayjs from "dayjs";
import { ClientPreferences } from "@/types/client/preferences";
import { Calendar, Global, MessageText } from "iconsax-react";

interface Props {
  data: ClientPreferences;
}

export const ClientPreferencesDetails = ({ data }: Props) => {
  const pref = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Routines & Lifestyle */}
      <Card>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="text-primary" size={20} />
              {/* <EmojiHappy size="32" color="#FF8A65" />
              <Home variant="Bold" />
              <Setting /> */}
              <h3 className="font-semibold text-lg">Routines & Lifestyle</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Daily routines and preferred things
            </p>
          </div>

          <div className="space-y-2">
            <InfoRow label="Morning Routine">
              {pref?.morningRoutine || "-"}
            </InfoRow>

            <InfoRow label="Sleep Habits">
              {pref?.sleepingHabits || "-"}
            </InfoRow>

            <InfoRow label="Daily Activities">
              {pref?.dailyActivities || "-"}
            </InfoRow>

            <InfoRow label="Preferred Visit Times">
              {pref?.preferredVisitTimes &&
              pref.preferredVisitTimes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {pref.preferredVisitTimes.map((v: string, idx: number) => (
                    <span
                      key={idx}
                      className="inline-block text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full border border-gray-100"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              ) : (
                "-"
              )}
            </InfoRow>
          </div>
        </CardContent>
      </Card>

      {/* Cultural & Faith */}
      <Card>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Global className="text-primary" size={20} />
              <h3 className="font-semibold text-lg">Cultural & Faith</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Religious and cultural considerations
            </p>
          </div>

          <div className="space-y-4">
            <InfoRow label="Religion / Faith">
              <p className="font-medium">{pref?.religionOrFaith || "-"}</p>
            </InfoRow>

            <InfoRow label="Faith Practices">
              {pref?.faithPractices || "-"}
            </InfoRow>

            <InfoRow label="Cultural Considerations">
              {pref?.culturalConsiderations || "-"}
            </InfoRow>
          </div>
        </CardContent>
      </Card>

      {/* Food & Diet */}
      <Card>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FoodIcon />
              <h3 className="font-semibold text-lg">Food & Diet</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Dietary preferences and restrictions
            </p>
          </div>

          <div className="space-y-4">
            <InfoRow label="Dietary Restrictions">
              {pref?.dietaryRestrictions &&
              pref.dietaryRestrictions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {pref.dietaryRestrictions.map((v: string, idx: number) => (
                    <span
                      key={idx}
                      className="inline-block text-xs px-2 py-1 rounded-full border"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              ) : (
                "-"
              )}
            </InfoRow>

            <InfoRow label="Likes">{pref?.foodLikes || "-"}</InfoRow>
            <InfoRow label="Dislikes">{pref?.foodDislikes || "-"}</InfoRow>

            <InfoRow label="Favourite Meals">
              {pref?.favouriteMeals || "-"}
            </InfoRow>
          </div>
        </CardContent>
      </Card>

      {/* Communication & Identity */}
      <Card>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageText className="text-primary" size={20} />
              <h3 className="font-semibold text-lg">
                Communication and Identity
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Language and interaction preferences
            </p>
          </div>

          <div className="space-y-4">
            <InfoRow label="Language">{pref?.preferredLanguage || "-"}</InfoRow>

            <InfoRow label="Interpreter">
              {typeof pref?.interpreterNeeded === "boolean"
                ? pref.interpreterNeeded
                  ? "Required"
                  : "Not needed"
                : "-"}
            </InfoRow>

            <InfoRow label="Communication Aids">
              {pref?.communicationAids || "-"}
            </InfoRow>

            <InfoRow label="Interaction Notes">
              {pref?.interactionNotes || "-"}
            </InfoRow>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

/* ---------- Icons (inline, same pattern as reference) ---------- */

const FoodIcon = () => (
  <svg
    width={15}
    height={19}
    viewBox="0 0 15 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.9 11.3C3.53652 11.3 4.14697 11.0471 4.59706 10.5971C5.04714 10.147 5.3 9.53652 5.3 8.9V0.5V5.3H0.5V0.5V8.9C0.5 9.53652 0.752856 10.147 1.20294 10.5971C1.65303 11.0471 2.26348 11.3 2.9 11.3ZM2.9 11.3V18.5M2.9 5.3V0.5M13.7 0.5V18.5H12.5V12.5H13.7H8.9V5.3C8.9 4.02696 9.40571 2.80606 10.3059 1.90589C11.2061 1.00571 12.427 0.5 13.7 0.5Z"
      stroke="#025134"
      strokeLinejoin="round"
    />
  </svg>
);

/* ---------- Uploaded screenshot path ---------- */
/*
/mnt/data/Screenshot 2025-11-25 at 10.44.44 PM.png
*/
