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

