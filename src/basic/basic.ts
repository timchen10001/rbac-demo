import * as casbin from 'casbin';

async function basic() {
  const enforcer = await casbin.newEnforcer(
    "examples/rbac_model.conf",
    "examples/rbac_policy.csv"
  );

  const sub = "alice"; // the user that wants ti access to a resource.
  const obj = "data1"; // the resource that is going to be access.
  const act = "read"; // the operation that the user performs on the resource.

  const res = await enforcer.enforce(sub, obj, act);

  if (res) {
    console.log(`"${sub}" is allowed to "${act}" ${obj}.`);
  } else {
    console.log(`"${sub}" is forbidden to "${act}" ${obj}.`);
  }
}

basic();
