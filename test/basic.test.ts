import * as casbin from "casbin";
import { Enforcer } from "casbin";

async function testEnforce(e: Enforcer, sub: string, obj: any, act: string, res: boolean): Promise<void> {
  await expect(e.enforce(sub, obj, act)).resolves.toBe(res);
}

test("TestKeyMatchModel", async () => {
  const e = await casbin.newEnforcer(
    "examples/keymatch_model.conf",
    "examples/keymatch_policy.csv"
  );

  await testEnforce(e, "alice", "/alice_data/resource1", "GET", true);
  await testEnforce(e, "alice", "/alice_data/resource1", "POST", true);
  await testEnforce(e, "alice", "/alice_data/resource2", "GET", true);
  await testEnforce(e, "alice", "/alice_data/resource2", "POST", false);
  await testEnforce(e, "alice", "/bob_data/resource1", "GET", false);
  await testEnforce(e, "alice", "/bob_data/resource1", "POST", false);
  await testEnforce(e, "alice", "/bob_data/resource2", "GET", false);
  await testEnforce(e, "alice", "/bob_data/resource2", "POST", false);

  await testEnforce(e, "bob", "/alice_data/resource1", "GET", false);
  await testEnforce(e, "bob", "/alice_data/resource1", "POST", false);
  await testEnforce(e, "bob", "/alice_data/resource2", "GET", true);
  await testEnforce(e, "bob", "/alice_data/resource2", "POST", false);
  await testEnforce(e, "bob", "/bob_data/resource1", "GET", false);
  await testEnforce(e, "bob", "/bob_data/resource1", "POST", true);
  await testEnforce(e, "bob", "/bob_data/resource2", "GET", false);
  await testEnforce(e, "bob", "/bob_data/resource2", "POST", true);

  await testEnforce(e, "cathy", "/cathy_data", "GET", true);
  await testEnforce(e, "cathy", "/cathy_data", "POST", true);
  await testEnforce(e, "cathy", "/cathy_data", "DELETE", false);
});
