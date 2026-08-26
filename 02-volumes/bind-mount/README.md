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

1. Bind mount connects host storage to container storage.

2. source = host path.

3. target = path inside container.

4. Changes on the host can be seen by the container.

5. Bind mounts are very useful during development.

6. Host files survive container removal.

7. Named volumes are managed by Docker.

8. Bind mounts are controlled through explicit host paths.

9. /app/node_modules can be hidden by an /app bind mount.

10. A separate volume can protect node_modules.

