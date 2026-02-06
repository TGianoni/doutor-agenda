"use client";

import { loadStripe } from "@stripe/stripe-js";
import { CheckCircle, Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";

import { createStripeCheckout } from "@/actions/create-stripe-checkout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const features = [
  "Cadastro de até 3 médicos",
  "Agendamentos ilimitados",
  "Métricas básicas",
  "Cadastro de pacientes",
  "Confirmação manual",
  "Suporte via e-mail",
];

interface SubscriptionPlanProps {
  active?: boolean;
}

export function SubscriptionPlan({ active = false }: SubscriptionPlanProps) {
  const createStripeCheckoutAction = useAction(createStripeCheckout, {
    onSuccess: async ({ data }) => {
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        throw new Error("Stripe publishable key not found");
      }
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      );
      if (!stripe) {
        throw new Error("Stripe not found");
      }
      if (!data?.sessionId) {
        throw new Error("Session ID not found");
      }
      await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
    },
  });

  const handleSubscribeClick = () => {
    createStripeCheckoutAction.execute();
  };
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="gap-1">
        <div className="flex items-center gap-2">
          <h3 className="text-foreground text-xl font-semibold">Essential</h3>
          {active && (
            <Badge className="bg-primary/10 text-primary hover:bg-success/90 border-transparent">
              Atual
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground text-sm">
          Para profissionais autônomos ou pequenas clínicas
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <div className="flex items-baseline gap-1">
          <span className="text-foreground text-3xl font-bold">R$59</span>
          <span className="text-muted-foreground text-sm">/ mês</span>
        </div>

        <ul className="flex flex-col gap-3" role="list">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <div className="bg-success/15 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                <CheckCircle
                  className="h-3 w-3 text-green-500"
                  aria-hidden="true"
                />
              </div>
              <span className="text-foreground text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        {active ? (
          <Button variant="outline" className="w-full bg-transparent">
            Gerenciar Assinatura
          </Button>
        ) : (
          <Button
            className="bg-success text-success-foreground hover:bg-success/90 w-full"
            onClick={active ? () => {} : handleSubscribeClick}
            disabled={createStripeCheckoutAction.isExecuting}
          >
            {createStripeCheckoutAction.isExecuting ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : active ? (
              "Gerenciar Assinatura"
            ) : (
              "Fazer assinatura"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
