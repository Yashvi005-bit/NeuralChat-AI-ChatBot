# TODO Steps to Fix MongoDB Connection Error

1. ✅ Create backend/.env with MONGODB_URL  
2. ✅ Fix imports in backend/src/db/connection.ts (remove unused app import)
3. ✅ Fix import in backend/src/index.ts (app.js → app.ts)
4. Rebuild the project: cd backend && npm run built  
5. Restart dev server: cd backend && npm run dev (stop any running server first)
6. ✅ Update .env with your MongoDB Atlas connection string
7. Verify connection success: Should log "Server Open & Connected to database" without errors

**Next Action:** Update backend/.env with valid MONGODB_URL (see instructions inside .env), then run rebuild and dev commands.

Progress: Code fixes complete. Ready for rebuild after .env setup.
