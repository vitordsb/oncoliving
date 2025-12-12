import { describe, it, expect, vi } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../api/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createOncologistContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "oncologist-test-001",
    email: "oncologist@test.local",
    name: "Test Oncologist",
    loginMethod: "local",
    role: "ONCOLOGIST",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as any,
  };
}

function createPatientContext(userId: number = 2): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `patient-test-${userId}`,
    email: `patient${userId}@test.local`,
    name: `Test Patient ${userId}`,
    loginMethod: "local",
    role: "PATIENT",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as any,
  };
}

describe("patients router", () => {
  describe("list", () => {
    it("should allow oncologists to list patients", async () => {
      const ctx = createOncologistContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.patients.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should reject non-oncologist users", async () => {
      const ctx = createPatientContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.patients.list();
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message).toContain("required permission");
      }
    });
  });

  describe("getById", () => {
    it("should allow patients to view their own profile", async () => {
      const ctx = createPatientContext(2);
      const caller = appRouter.createCaller(ctx);

      // Patient viewing their own profile
      const result = await caller.patients.getById({ patientId: 2 });
      expect(result).toBeDefined();
      expect(result.id).toBe(2);
    });

    it("should reject patients viewing other patients' profiles", async () => {
      const ctx = createPatientContext(2);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.patients.getById({ patientId: 3 });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized") || expect(error.message).toContain("error");
      }
    });

    it("should allow oncologists to view any patient profile", async () => {
      const ctx = createOncologistContext();
      const caller = appRouter.createCaller(ctx);

      // Oncologist viewing any patient's profile
      const result = await caller.patients.getById({ patientId: 2 });
      expect(result).toBeDefined();
    });
  });

  describe("updateProfile", () => {
    it("should allow patients to update their own profile", async () => {
      const ctx = createPatientContext(2);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.patients.updateProfile({
        patientId: 2,
        mainDiagnosis: "Breast Cancer",
        treatmentStage: "during-chemo",
      });

      expect(result).toBeDefined();
      expect(result?.mainDiagnosis).toBe("Breast Cancer");
    });

    it("should reject patients updating other patients' profiles", async () => {
      const ctx = createPatientContext(2);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.patients.updateProfile({
          patientId: 3,
          mainDiagnosis: "Lung Cancer",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized") || expect(error.message).toContain("error");
      }
    });

    it("should allow oncologists to update any patient profile", async () => {
      const ctx = createOncologistContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.patients.updateProfile({
        patientId: 2,
        mainDiagnosis: "Colorectal Cancer",
        treatmentStage: "post-treatment",
      });

      expect(result).toBeDefined();
      expect(result?.mainDiagnosis).toBe("Colorectal Cancer");
    });
  });
});
