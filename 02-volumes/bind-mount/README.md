# Docker Bind Mounts

This experiment demonstrates Docker Bind Mounts, how they work, and when to use them.

---

## 1. What is a Bind Mount?

A Bind Mount connects a specific directory/file from the **host machine** to a directory inside a **container**.

```text
Host
./app
  │
  │ Bind Mount
  ↓
Container
/app
```


## Key Takeaways

1. A Bind Mount connects a host file/directory to a container path. 
2. source represents the host path.
3. target represents the path inside the container.
4. Changes made on the host can be seen inside the container.
5. Bind Mounts are very useful during development.
6. Host files survive container removal.
7. Named Volumes are managed by Docker.
8. Bind Mounts use an explicitly selected host path.
9. Mounting a host directory over /app can hide the container's original /app/node_modules.
10. A separate volume can be used for /app/node_modules.

