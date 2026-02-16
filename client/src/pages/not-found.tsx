import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  const { user, isAuthenticated } = useAuth();
  const hasSentAutoMessage = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !user || hasSentAutoMessage.current) return;

    hasSentAutoMessage.current = true;
    void supabase.from("messages").insert({
      user_id: user.id,
      subject: "Error Error",
      description: `Student encountered 404 error with user id: ${user.id}`,
    });
  }, [isAuthenticated, user]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Oops, there may be a problem if there&apos;s an error loading this page.
          </p>
          {isAuthenticated && (
            <Button
              className="mt-4"
              variant="outline"
              onClick={() =>
                window.open(
                  "mailto:germaine@germainetutoring.com?subject=Student%20Message&body=I%20hit%20a%20404%20page%20and%20need%20help.",
                  "_blank",
                )
              }
            >
              Use Messager
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
