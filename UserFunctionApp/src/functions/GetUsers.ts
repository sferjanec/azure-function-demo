import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Client } from "pg";

export async function GetUsers(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Fetching users from PostgreSQL... `);

    const client = new Client({
      host: "<redacted>",
      port: 5432,
      user: "<redacted>",
      password: "<redacted>",
      database: "flexibleserverdb",
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      const result = await client.query("SELECT * FROM users");
      await client.end();

      return {
          status: 200,
          body: JSON.stringify(result.rows)
      };
  } catch (error: any) {
      context.log(`Error querying database: ${error.message}`);
      return {
          status: 500,
          body: JSON.stringify({ error: "Failed to fetch users from database" })
      };
  }

}

app.http('GetUsers', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: GetUsers
});
