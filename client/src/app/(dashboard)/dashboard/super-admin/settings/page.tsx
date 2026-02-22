"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Mail, Percent, Megaphone, ShieldAlert } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  useUpdateSettings,
  useSuperAdminSettings,
} from "@/features/super-admin/hooks/useSuperAdmin";
import {
  platformSettingsSchema,
  PlatformSettingsValues,
} from "@/features/super-admin/schemas";

export default function PlatformSettingsPage() {
  const { data: settings, isLoading: isFetching } = useSuperAdminSettings();
  const { mutate: updateSettings, isPending: isUpdating } = useUpdateSettings();

  const form = useForm<PlatformSettingsValues>({
    resolver: zodResolver(platformSettingsSchema),
    defaultValues: {
      commissionPercentage: 20,
      contactEmail: "",
      supportEmail: "",
      globalBannerText: "",
      isMaintenanceMode: false,
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        commissionPercentage: settings.commissionPercentage,
        contactEmail: settings.contactEmail,
        supportEmail: settings.supportEmail,
        globalBannerText: settings.globalBannerText || "",
        isMaintenanceMode: settings.isMaintenanceMode,
      });
    }
  }, [settings, form]);

  const onSubmit = (values: PlatformSettingsValues) => {
    updateSettings(values);
  };

  if (isFetching) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-20 bg-muted/20 rounded-2xl" />
        <div className="grid grid-cols-2 gap-6">
          <div className="h-64 bg-muted/20 rounded-2xl" />
          <div className="h-64 bg-muted/20 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Platform Configuration
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure global platform behavior, policies, and system status.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Financial Settings */}
            <Card className="">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="w-5 h-5 text-primary" />
                  Financial Policy
                </CardTitle>
                <CardDescription>
                  Configure platform-wide financial parameters.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="commissionPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform Commission (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value || 0}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        The percentage the platform takes from each sale.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Communication Settings */}
            <Card className="">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Communication
                </CardTitle>
                <CardDescription>
                  Default platform contact destinations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Contact Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="supportEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technical Support Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* System Visibility */}
            <Card className="">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-primary" />
                  Global Announcements
                </CardTitle>
                <CardDescription>
                  Manage sitewide messages and banners.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="globalBannerText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Announcement Banner Text</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ""}
                          placeholder="Enter banner message..."
                        />
                      </FormControl>
                      <FormDescription>
                        This text will appear at the top of every page for all
                        users.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* System Health */}
            <Card className=" border-destructive/20 bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <ShieldAlert className="w-5 h-5" />
                  Critical Operations
                </CardTitle>
                <CardDescription>
                  Experimental and high-impact system controls.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="isMaintenanceMode"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border border-destructive/20 p-4 bg-background">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Maintenance Mode
                        </FormLabel>
                        <FormDescription>
                          Prevent all non-admin users from accessing the
                          platform.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={!!field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-4 p-4 border-t sticky bottom-0 bg-background/80 backdrop-blur-sm">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Discard Changes
            </Button>
            <Button type="submit" className="gap-2" disabled={isUpdating}>
              <Save className="w-4 h-4" />
              {isUpdating ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
