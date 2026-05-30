db.createUser({
  user: "gpulist",
  pwd: 'password',
  roles: [
    {
      role: "dbOwner",
      db: "gpus",
    },
  ],
});

db.createCollection("gpus");
