"use client";

import Select from "@/components/form/Select";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/i18n/navigation";
import { useData } from "@/lib/mock/store";
import type { Role } from "@/lib/mock/types";
import { useMemo, useState } from "react";

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "administrator", label: "Administrator — Admin Portal" },
  { value: "manager", label: "Manager — Admin Portal" },
  { value: "broker", label: "Broker — Admin Portal" },
  { value: "client_primary", label: "Client Contact — User Portal" },
];

export default function SignInForm() {
  const { state } = useData();
  const { login } = useAuth();
  const router = useRouter();

  const [role, setRole] = useState<Role>("broker");
  const usersForRole = useMemo(
    () => state.users.filter((u) => (role === "client_primary" ? u.role === "client_primary" || u.role === "client_secondary" : u.role === role)),
    [state.users, role],
  );
  const [userId, setUserId] = useState(usersForRole[0]?.id ?? "");

  const activeUserId = usersForRole.some((u) => u.id === userId) ? userId : (usersForRole[0]?.id ?? "");
  const selectedUser = usersForRole.find((u) => u.id === activeUserId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeUserId) return;
    login(activeUserId);
    router.push("/mfa-challenge");
  }

  return (
    <div className="flex w-full flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 text-title-sm font-medium tracking-tight text-ink sm:text-title-md dark:text-white">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Prototype sign-in — no real credentials are checked. Choose a role and
              account below to explore that role&apos;s experience.
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <Label>I am signing in as</Label>
                <Select
                  options={ROLE_OPTIONS}
                  defaultValue={role}
                  onChange={(value) => setRole(value as Role)}
                />
              </div>
              <div>
                <Label>Account</Label>
                <Select
                  key={role}
                  options={usersForRole.map((u) => ({
                    value: u.id,
                    label: role === "client_primary" ? `${u.name} — ${u.role === "client_primary" ? "Primary" : "Secondary"} contact` : u.name,
                  }))}
                  defaultValue={activeUserId}
                  onChange={(value) => setUserId(value)}
                />
              </div>
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input placeholder="info@example.com" defaultValue={selectedUser?.email} />
              </div>
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <Input type="password" placeholder="Enter any password" />
              </div>
              <div>
                <Button className="w-full" disabled={!activeUserId}>
                  Sign In
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
