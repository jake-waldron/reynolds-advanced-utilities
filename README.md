# Next.js + Tailwindcss + Jest + Cypress + Prisma + Supabase Starter

## Requirements

- [pnpm](https://pnpm.io/)
- [zsh](https://www.zsh.org/)
- zmv - Add `autoload -U zmv` to `~/.zshrc`

## Setup

1. Start new project with `pnpm create next-app --example https://github.com/jake-waldron/next-starter-repo/tree/supabase`
2. Run `zmv -w '.env(*.)local.example' '.env${1}local'` to rename env files
   - Example: `.env.local.example` to `.env.local`
3. Set environment variables
4. Run `prisma generate` to set up Prisma for development
5. Run `dotenv -e .env.development.local prisma db push` to set up database with Prisma Schema

## Add users to public table on Supabase Auth user creation

Add Function: https://app.supabase.com/project/{ProjectID}/database/functions

- Name: `handle_new_user`
- Schema: `public`
- Return type: `trigger`
- Definition:
  ```
  begin
   insert into public.users (id, email)
   values (new.id, new.email);
   return new;
  end;
  ```

Add Trigger: https://app.supabase.com/project/{ProjectID}/database/triggers

- Name: `on_auth_user_created`
- Table: `users:auth`
- Event: `INSERT`
- Trigger type: `After the event`
- Enabled mode: `Origin`
