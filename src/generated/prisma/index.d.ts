
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Role
 * 
 */
export type Role = $Result.DefaultSelection<Prisma.$RolePayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Useroncompany
 * 
 */
export type Useroncompany = $Result.DefaultSelection<Prisma.$UseroncompanyPayload>
/**
 * Model Useronpage
 * 
 */
export type Useronpage = $Result.DefaultSelection<Prisma.$UseronpagePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Roles
 * const roles = await prisma.role.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Roles
   * const roles = await prisma.role.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.role`: Exposes CRUD operations for the **Role** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Roles
    * const roles = await prisma.role.findMany()
    * ```
    */
  get role(): Prisma.RoleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.useroncompany`: Exposes CRUD operations for the **Useroncompany** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Useroncompanies
    * const useroncompanies = await prisma.useroncompany.findMany()
    * ```
    */
  get useroncompany(): Prisma.UseroncompanyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.useronpage`: Exposes CRUD operations for the **Useronpage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Useronpages
    * const useronpages = await prisma.useronpage.findMany()
    * ```
    */
  get useronpage(): Prisma.UseronpageDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.18.0
   * Query Engine version: 34b5a692b7bd79939a9a2c3ef97d816e749cda2f
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Role: 'Role',
    User: 'User',
    Useroncompany: 'Useroncompany',
    Useronpage: 'Useronpage'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "role" | "user" | "useroncompany" | "useronpage"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Role: {
        payload: Prisma.$RolePayload<ExtArgs>
        fields: Prisma.RoleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          findFirst: {
            args: Prisma.RoleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          findMany: {
            args: Prisma.RoleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          create: {
            args: Prisma.RoleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          createMany: {
            args: Prisma.RoleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.RoleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          update: {
            args: Prisma.RoleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          deleteMany: {
            args: Prisma.RoleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RoleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          aggregate: {
            args: Prisma.RoleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRole>
          }
          groupBy: {
            args: Prisma.RoleGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoleGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoleCountArgs<ExtArgs>
            result: $Utils.Optional<RoleCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Useroncompany: {
        payload: Prisma.$UseroncompanyPayload<ExtArgs>
        fields: Prisma.UseroncompanyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UseroncompanyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UseroncompanyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UseroncompanyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UseroncompanyPayload>
          }
          findFirst: {
            args: Prisma.UseroncompanyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UseroncompanyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UseroncompanyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UseroncompanyPayload>
          }
          findMany: {
            args: Prisma.UseroncompanyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UseroncompanyPayload>[]
          }
          create: {
            args: Prisma.UseroncompanyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UseroncompanyPayload>
          }
          createMany: {
            args: Prisma.UseroncompanyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UseroncompanyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UseroncompanyPayload>
          }
          update: {
            args: Prisma.UseroncompanyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UseroncompanyPayload>
          }
          deleteMany: {
            args: Prisma.UseroncompanyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UseroncompanyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UseroncompanyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UseroncompanyPayload>
          }
          aggregate: {
            args: Prisma.UseroncompanyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUseroncompany>
          }
          groupBy: {
            args: Prisma.UseroncompanyGroupByArgs<ExtArgs>
            result: $Utils.Optional<UseroncompanyGroupByOutputType>[]
          }
          count: {
            args: Prisma.UseroncompanyCountArgs<ExtArgs>
            result: $Utils.Optional<UseroncompanyCountAggregateOutputType> | number
          }
        }
      }
      Useronpage: {
        payload: Prisma.$UseronpagePayload<ExtArgs>
        fields: Prisma.UseronpageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UseronpageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UseronpagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UseronpageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UseronpagePayload>
          }
          findFirst: {
            args: Prisma.UseronpageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UseronpagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UseronpageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UseronpagePayload>
          }
          findMany: {
            args: Prisma.UseronpageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UseronpagePayload>[]
          }
          create: {
            args: Prisma.UseronpageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UseronpagePayload>
          }
          createMany: {
            args: Prisma.UseronpageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UseronpageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UseronpagePayload>
          }
          update: {
            args: Prisma.UseronpageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UseronpagePayload>
          }
          deleteMany: {
            args: Prisma.UseronpageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UseronpageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UseronpageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UseronpagePayload>
          }
          aggregate: {
            args: Prisma.UseronpageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUseronpage>
          }
          groupBy: {
            args: Prisma.UseronpageGroupByArgs<ExtArgs>
            result: $Utils.Optional<UseronpageGroupByOutputType>[]
          }
          count: {
            args: Prisma.UseronpageCountArgs<ExtArgs>
            result: $Utils.Optional<UseronpageCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    role?: RoleOmit
    user?: UserOmit
    useroncompany?: UseroncompanyOmit
    useronpage?: UseronpageOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    Useronpage: number
    Useroncompany: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Useronpage?: boolean | UserCountOutputTypeCountUseronpageArgs
    Useroncompany?: boolean | UserCountOutputTypeCountUseroncompanyArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountUseronpageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UseronpageWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountUseroncompanyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UseroncompanyWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Role
   */

  export type AggregateRole = {
    _count: RoleCountAggregateOutputType | null
    _avg: RoleAvgAggregateOutputType | null
    _sum: RoleSumAggregateOutputType | null
    _min: RoleMinAggregateOutputType | null
    _max: RoleMaxAggregateOutputType | null
  }

  export type RoleAvgAggregateOutputType = {
    id: number | null
  }

  export type RoleSumAggregateOutputType = {
    id: number | null
  }

  export type RoleMinAggregateOutputType = {
    id: number | null
    rolename: string | null
    active: boolean | null
  }

  export type RoleMaxAggregateOutputType = {
    id: number | null
    rolename: string | null
    active: boolean | null
  }

  export type RoleCountAggregateOutputType = {
    id: number
    rolename: number
    active: number
    _all: number
  }


  export type RoleAvgAggregateInputType = {
    id?: true
  }

  export type RoleSumAggregateInputType = {
    id?: true
  }

  export type RoleMinAggregateInputType = {
    id?: true
    rolename?: true
    active?: true
  }

  export type RoleMaxAggregateInputType = {
    id?: true
    rolename?: true
    active?: true
  }

  export type RoleCountAggregateInputType = {
    id?: true
    rolename?: true
    active?: true
    _all?: true
  }

  export type RoleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Role to aggregate.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Roles
    **/
    _count?: true | RoleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RoleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RoleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoleMaxAggregateInputType
  }

  export type GetRoleAggregateType<T extends RoleAggregateArgs> = {
        [P in keyof T & keyof AggregateRole]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRole[P]>
      : GetScalarType<T[P], AggregateRole[P]>
  }




  export type RoleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoleWhereInput
    orderBy?: RoleOrderByWithAggregationInput | RoleOrderByWithAggregationInput[]
    by: RoleScalarFieldEnum[] | RoleScalarFieldEnum
    having?: RoleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoleCountAggregateInputType | true
    _avg?: RoleAvgAggregateInputType
    _sum?: RoleSumAggregateInputType
    _min?: RoleMinAggregateInputType
    _max?: RoleMaxAggregateInputType
  }

  export type RoleGroupByOutputType = {
    id: number
    rolename: string | null
    active: boolean | null
    _count: RoleCountAggregateOutputType | null
    _avg: RoleAvgAggregateOutputType | null
    _sum: RoleSumAggregateOutputType | null
    _min: RoleMinAggregateOutputType | null
    _max: RoleMaxAggregateOutputType | null
  }

  type GetRoleGroupByPayload<T extends RoleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoleGroupByOutputType[P]>
            : GetScalarType<T[P], RoleGroupByOutputType[P]>
        }
      >
    >


  export type RoleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    rolename?: boolean
    active?: boolean
  }, ExtArgs["result"]["role"]>



  export type RoleSelectScalar = {
    id?: boolean
    rolename?: boolean
    active?: boolean
  }

  export type RoleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "rolename" | "active", ExtArgs["result"]["role"]>

  export type $RolePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Role"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      rolename: string | null
      active: boolean | null
    }, ExtArgs["result"]["role"]>
    composites: {}
  }

  type RoleGetPayload<S extends boolean | null | undefined | RoleDefaultArgs> = $Result.GetResult<Prisma.$RolePayload, S>

  type RoleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoleCountAggregateInputType | true
    }

  export interface RoleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Role'], meta: { name: 'Role' } }
    /**
     * Find zero or one Role that matches the filter.
     * @param {RoleFindUniqueArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoleFindUniqueArgs>(args: SelectSubset<T, RoleFindUniqueArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Role that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoleFindUniqueOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoleFindUniqueOrThrowArgs>(args: SelectSubset<T, RoleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Role that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoleFindFirstArgs>(args?: SelectSubset<T, RoleFindFirstArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Role that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoleFindFirstOrThrowArgs>(args?: SelectSubset<T, RoleFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Roles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Roles
     * const roles = await prisma.role.findMany()
     * 
     * // Get first 10 Roles
     * const roles = await prisma.role.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roleWithIdOnly = await prisma.role.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoleFindManyArgs>(args?: SelectSubset<T, RoleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Role.
     * @param {RoleCreateArgs} args - Arguments to create a Role.
     * @example
     * // Create one Role
     * const Role = await prisma.role.create({
     *   data: {
     *     // ... data to create a Role
     *   }
     * })
     * 
     */
    create<T extends RoleCreateArgs>(args: SelectSubset<T, RoleCreateArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Roles.
     * @param {RoleCreateManyArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const role = await prisma.role.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoleCreateManyArgs>(args?: SelectSubset<T, RoleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Role.
     * @param {RoleDeleteArgs} args - Arguments to delete one Role.
     * @example
     * // Delete one Role
     * const Role = await prisma.role.delete({
     *   where: {
     *     // ... filter to delete one Role
     *   }
     * })
     * 
     */
    delete<T extends RoleDeleteArgs>(args: SelectSubset<T, RoleDeleteArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Role.
     * @param {RoleUpdateArgs} args - Arguments to update one Role.
     * @example
     * // Update one Role
     * const role = await prisma.role.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoleUpdateArgs>(args: SelectSubset<T, RoleUpdateArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Roles.
     * @param {RoleDeleteManyArgs} args - Arguments to filter Roles to delete.
     * @example
     * // Delete a few Roles
     * const { count } = await prisma.role.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoleDeleteManyArgs>(args?: SelectSubset<T, RoleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Roles
     * const role = await prisma.role.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoleUpdateManyArgs>(args: SelectSubset<T, RoleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Role.
     * @param {RoleUpsertArgs} args - Arguments to update or create a Role.
     * @example
     * // Update or create a Role
     * const role = await prisma.role.upsert({
     *   create: {
     *     // ... data to create a Role
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Role we want to update
     *   }
     * })
     */
    upsert<T extends RoleUpsertArgs>(args: SelectSubset<T, RoleUpsertArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleCountArgs} args - Arguments to filter Roles to count.
     * @example
     * // Count the number of Roles
     * const count = await prisma.role.count({
     *   where: {
     *     // ... the filter for the Roles we want to count
     *   }
     * })
    **/
    count<T extends RoleCountArgs>(
      args?: Subset<T, RoleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoleAggregateArgs>(args: Subset<T, RoleAggregateArgs>): Prisma.PrismaPromise<GetRoleAggregateType<T>>

    /**
     * Group by Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoleGroupByArgs['orderBy'] }
        : { orderBy?: RoleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Role model
   */
  readonly fields: RoleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Role.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Role model
   */
  interface RoleFieldRefs {
    readonly id: FieldRef<"Role", 'Int'>
    readonly rolename: FieldRef<"Role", 'String'>
    readonly active: FieldRef<"Role", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Role findUnique
   */
  export type RoleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role findUniqueOrThrow
   */
  export type RoleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role findFirst
   */
  export type RoleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role findFirstOrThrow
   */
  export type RoleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role findMany
   */
  export type RoleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Filter, which Roles to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role create
   */
  export type RoleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * The data needed to create a Role.
     */
    data?: XOR<RoleCreateInput, RoleUncheckedCreateInput>
  }

  /**
   * Role createMany
   */
  export type RoleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Roles.
     */
    data: RoleCreateManyInput | RoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Role update
   */
  export type RoleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * The data needed to update a Role.
     */
    data: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>
    /**
     * Choose, which Role to update.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role updateMany
   */
  export type RoleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Roles.
     */
    data: XOR<RoleUpdateManyMutationInput, RoleUncheckedUpdateManyInput>
    /**
     * Filter which Roles to update
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to update.
     */
    limit?: number
  }

  /**
   * Role upsert
   */
  export type RoleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * The filter to search for the Role to update in case it exists.
     */
    where: RoleWhereUniqueInput
    /**
     * In case the Role found by the `where` argument doesn't exist, create a new Role with this data.
     */
    create: XOR<RoleCreateInput, RoleUncheckedCreateInput>
    /**
     * In case the Role was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>
  }

  /**
   * Role delete
   */
  export type RoleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Filter which Role to delete.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role deleteMany
   */
  export type RoleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Roles to delete
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to delete.
     */
    limit?: number
  }

  /**
   * Role without action
   */
  export type RoleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
    roleId: number | null
    employeeId: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
    roleId: number | null
    employeeId: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    roleId: number | null
    username: string | null
    employeeId: number | null
    active: boolean | null
    password: string | null
    comCode: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    roleId: number | null
    username: string | null
    employeeId: number | null
    active: boolean | null
    password: string | null
    comCode: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    roleId: number
    username: number
    employeeId: number
    active: number
    password: number
    comCode: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
    roleId?: true
    employeeId?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
    roleId?: true
    employeeId?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    roleId?: true
    username?: true
    employeeId?: true
    active?: true
    password?: true
    comCode?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    roleId?: true
    username?: true
    employeeId?: true
    active?: true
    password?: true
    comCode?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    roleId?: true
    username?: true
    employeeId?: true
    active?: true
    password?: true
    comCode?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    roleId: number | null
    username: string | null
    employeeId: number | null
    active: boolean | null
    password: string | null
    comCode: string | null
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roleId?: boolean
    username?: boolean
    employeeId?: boolean
    active?: boolean
    password?: boolean
    comCode?: boolean
    Useronpage?: boolean | User$UseronpageArgs<ExtArgs>
    Useroncompany?: boolean | User$UseroncompanyArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>



  export type UserSelectScalar = {
    id?: boolean
    roleId?: boolean
    username?: boolean
    employeeId?: boolean
    active?: boolean
    password?: boolean
    comCode?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "roleId" | "username" | "employeeId" | "active" | "password" | "comCode", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Useronpage?: boolean | User$UseronpageArgs<ExtArgs>
    Useroncompany?: boolean | User$UseroncompanyArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      Useronpage: Prisma.$UseronpagePayload<ExtArgs>[]
      Useroncompany: Prisma.$UseroncompanyPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      roleId: number | null
      username: string | null
      employeeId: number | null
      active: boolean | null
      password: string | null
      comCode: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Useronpage<T extends User$UseronpageArgs<ExtArgs> = {}>(args?: Subset<T, User$UseronpageArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UseronpagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Useroncompany<T extends User$UseroncompanyArgs<ExtArgs> = {}>(args?: Subset<T, User$UseroncompanyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UseroncompanyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly roleId: FieldRef<"User", 'Int'>
    readonly username: FieldRef<"User", 'String'>
    readonly employeeId: FieldRef<"User", 'Int'>
    readonly active: FieldRef<"User", 'Boolean'>
    readonly password: FieldRef<"User", 'String'>
    readonly comCode: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data?: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.Useronpage
   */
  export type User$UseronpageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Useronpage
     */
    select?: UseronpageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Useronpage
     */
    omit?: UseronpageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UseronpageInclude<ExtArgs> | null
    where?: UseronpageWhereInput
    orderBy?: UseronpageOrderByWithRelationInput | UseronpageOrderByWithRelationInput[]
    cursor?: UseronpageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UseronpageScalarFieldEnum | UseronpageScalarFieldEnum[]
  }

  /**
   * User.Useroncompany
   */
  export type User$UseroncompanyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Useroncompany
     */
    select?: UseroncompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Useroncompany
     */
    omit?: UseroncompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UseroncompanyInclude<ExtArgs> | null
    where?: UseroncompanyWhereInput
    orderBy?: UseroncompanyOrderByWithRelationInput | UseroncompanyOrderByWithRelationInput[]
    cursor?: UseroncompanyWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UseroncompanyScalarFieldEnum | UseroncompanyScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Useroncompany
   */

  export type AggregateUseroncompany = {
    _count: UseroncompanyCountAggregateOutputType | null
    _avg: UseroncompanyAvgAggregateOutputType | null
    _sum: UseroncompanySumAggregateOutputType | null
    _min: UseroncompanyMinAggregateOutputType | null
    _max: UseroncompanyMaxAggregateOutputType | null
  }

  export type UseroncompanyAvgAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type UseroncompanySumAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type UseroncompanyMinAggregateOutputType = {
    id: number | null
    companyName: string | null
    userId: number | null
  }

  export type UseroncompanyMaxAggregateOutputType = {
    id: number | null
    companyName: string | null
    userId: number | null
  }

  export type UseroncompanyCountAggregateOutputType = {
    id: number
    companyName: number
    userId: number
    _all: number
  }


  export type UseroncompanyAvgAggregateInputType = {
    id?: true
    userId?: true
  }

  export type UseroncompanySumAggregateInputType = {
    id?: true
    userId?: true
  }

  export type UseroncompanyMinAggregateInputType = {
    id?: true
    companyName?: true
    userId?: true
  }

  export type UseroncompanyMaxAggregateInputType = {
    id?: true
    companyName?: true
    userId?: true
  }

  export type UseroncompanyCountAggregateInputType = {
    id?: true
    companyName?: true
    userId?: true
    _all?: true
  }

  export type UseroncompanyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Useroncompany to aggregate.
     */
    where?: UseroncompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Useroncompanies to fetch.
     */
    orderBy?: UseroncompanyOrderByWithRelationInput | UseroncompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UseroncompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Useroncompanies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Useroncompanies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Useroncompanies
    **/
    _count?: true | UseroncompanyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UseroncompanyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UseroncompanySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UseroncompanyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UseroncompanyMaxAggregateInputType
  }

  export type GetUseroncompanyAggregateType<T extends UseroncompanyAggregateArgs> = {
        [P in keyof T & keyof AggregateUseroncompany]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUseroncompany[P]>
      : GetScalarType<T[P], AggregateUseroncompany[P]>
  }




  export type UseroncompanyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UseroncompanyWhereInput
    orderBy?: UseroncompanyOrderByWithAggregationInput | UseroncompanyOrderByWithAggregationInput[]
    by: UseroncompanyScalarFieldEnum[] | UseroncompanyScalarFieldEnum
    having?: UseroncompanyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UseroncompanyCountAggregateInputType | true
    _avg?: UseroncompanyAvgAggregateInputType
    _sum?: UseroncompanySumAggregateInputType
    _min?: UseroncompanyMinAggregateInputType
    _max?: UseroncompanyMaxAggregateInputType
  }

  export type UseroncompanyGroupByOutputType = {
    id: number
    companyName: string | null
    userId: number
    _count: UseroncompanyCountAggregateOutputType | null
    _avg: UseroncompanyAvgAggregateOutputType | null
    _sum: UseroncompanySumAggregateOutputType | null
    _min: UseroncompanyMinAggregateOutputType | null
    _max: UseroncompanyMaxAggregateOutputType | null
  }

  type GetUseroncompanyGroupByPayload<T extends UseroncompanyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UseroncompanyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UseroncompanyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UseroncompanyGroupByOutputType[P]>
            : GetScalarType<T[P], UseroncompanyGroupByOutputType[P]>
        }
      >
    >


  export type UseroncompanySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    companyName?: boolean
    userId?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["useroncompany"]>



  export type UseroncompanySelectScalar = {
    id?: boolean
    companyName?: boolean
    userId?: boolean
  }

  export type UseroncompanyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "companyName" | "userId", ExtArgs["result"]["useroncompany"]>
  export type UseroncompanyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UseroncompanyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Useroncompany"
    objects: {
      User: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      companyName: string | null
      userId: number
    }, ExtArgs["result"]["useroncompany"]>
    composites: {}
  }

  type UseroncompanyGetPayload<S extends boolean | null | undefined | UseroncompanyDefaultArgs> = $Result.GetResult<Prisma.$UseroncompanyPayload, S>

  type UseroncompanyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UseroncompanyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UseroncompanyCountAggregateInputType | true
    }

  export interface UseroncompanyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Useroncompany'], meta: { name: 'Useroncompany' } }
    /**
     * Find zero or one Useroncompany that matches the filter.
     * @param {UseroncompanyFindUniqueArgs} args - Arguments to find a Useroncompany
     * @example
     * // Get one Useroncompany
     * const useroncompany = await prisma.useroncompany.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UseroncompanyFindUniqueArgs>(args: SelectSubset<T, UseroncompanyFindUniqueArgs<ExtArgs>>): Prisma__UseroncompanyClient<$Result.GetResult<Prisma.$UseroncompanyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Useroncompany that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UseroncompanyFindUniqueOrThrowArgs} args - Arguments to find a Useroncompany
     * @example
     * // Get one Useroncompany
     * const useroncompany = await prisma.useroncompany.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UseroncompanyFindUniqueOrThrowArgs>(args: SelectSubset<T, UseroncompanyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UseroncompanyClient<$Result.GetResult<Prisma.$UseroncompanyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Useroncompany that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UseroncompanyFindFirstArgs} args - Arguments to find a Useroncompany
     * @example
     * // Get one Useroncompany
     * const useroncompany = await prisma.useroncompany.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UseroncompanyFindFirstArgs>(args?: SelectSubset<T, UseroncompanyFindFirstArgs<ExtArgs>>): Prisma__UseroncompanyClient<$Result.GetResult<Prisma.$UseroncompanyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Useroncompany that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UseroncompanyFindFirstOrThrowArgs} args - Arguments to find a Useroncompany
     * @example
     * // Get one Useroncompany
     * const useroncompany = await prisma.useroncompany.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UseroncompanyFindFirstOrThrowArgs>(args?: SelectSubset<T, UseroncompanyFindFirstOrThrowArgs<ExtArgs>>): Prisma__UseroncompanyClient<$Result.GetResult<Prisma.$UseroncompanyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Useroncompanies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UseroncompanyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Useroncompanies
     * const useroncompanies = await prisma.useroncompany.findMany()
     * 
     * // Get first 10 Useroncompanies
     * const useroncompanies = await prisma.useroncompany.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const useroncompanyWithIdOnly = await prisma.useroncompany.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UseroncompanyFindManyArgs>(args?: SelectSubset<T, UseroncompanyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UseroncompanyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Useroncompany.
     * @param {UseroncompanyCreateArgs} args - Arguments to create a Useroncompany.
     * @example
     * // Create one Useroncompany
     * const Useroncompany = await prisma.useroncompany.create({
     *   data: {
     *     // ... data to create a Useroncompany
     *   }
     * })
     * 
     */
    create<T extends UseroncompanyCreateArgs>(args: SelectSubset<T, UseroncompanyCreateArgs<ExtArgs>>): Prisma__UseroncompanyClient<$Result.GetResult<Prisma.$UseroncompanyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Useroncompanies.
     * @param {UseroncompanyCreateManyArgs} args - Arguments to create many Useroncompanies.
     * @example
     * // Create many Useroncompanies
     * const useroncompany = await prisma.useroncompany.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UseroncompanyCreateManyArgs>(args?: SelectSubset<T, UseroncompanyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Useroncompany.
     * @param {UseroncompanyDeleteArgs} args - Arguments to delete one Useroncompany.
     * @example
     * // Delete one Useroncompany
     * const Useroncompany = await prisma.useroncompany.delete({
     *   where: {
     *     // ... filter to delete one Useroncompany
     *   }
     * })
     * 
     */
    delete<T extends UseroncompanyDeleteArgs>(args: SelectSubset<T, UseroncompanyDeleteArgs<ExtArgs>>): Prisma__UseroncompanyClient<$Result.GetResult<Prisma.$UseroncompanyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Useroncompany.
     * @param {UseroncompanyUpdateArgs} args - Arguments to update one Useroncompany.
     * @example
     * // Update one Useroncompany
     * const useroncompany = await prisma.useroncompany.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UseroncompanyUpdateArgs>(args: SelectSubset<T, UseroncompanyUpdateArgs<ExtArgs>>): Prisma__UseroncompanyClient<$Result.GetResult<Prisma.$UseroncompanyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Useroncompanies.
     * @param {UseroncompanyDeleteManyArgs} args - Arguments to filter Useroncompanies to delete.
     * @example
     * // Delete a few Useroncompanies
     * const { count } = await prisma.useroncompany.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UseroncompanyDeleteManyArgs>(args?: SelectSubset<T, UseroncompanyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Useroncompanies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UseroncompanyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Useroncompanies
     * const useroncompany = await prisma.useroncompany.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UseroncompanyUpdateManyArgs>(args: SelectSubset<T, UseroncompanyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Useroncompany.
     * @param {UseroncompanyUpsertArgs} args - Arguments to update or create a Useroncompany.
     * @example
     * // Update or create a Useroncompany
     * const useroncompany = await prisma.useroncompany.upsert({
     *   create: {
     *     // ... data to create a Useroncompany
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Useroncompany we want to update
     *   }
     * })
     */
    upsert<T extends UseroncompanyUpsertArgs>(args: SelectSubset<T, UseroncompanyUpsertArgs<ExtArgs>>): Prisma__UseroncompanyClient<$Result.GetResult<Prisma.$UseroncompanyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Useroncompanies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UseroncompanyCountArgs} args - Arguments to filter Useroncompanies to count.
     * @example
     * // Count the number of Useroncompanies
     * const count = await prisma.useroncompany.count({
     *   where: {
     *     // ... the filter for the Useroncompanies we want to count
     *   }
     * })
    **/
    count<T extends UseroncompanyCountArgs>(
      args?: Subset<T, UseroncompanyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UseroncompanyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Useroncompany.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UseroncompanyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UseroncompanyAggregateArgs>(args: Subset<T, UseroncompanyAggregateArgs>): Prisma.PrismaPromise<GetUseroncompanyAggregateType<T>>

    /**
     * Group by Useroncompany.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UseroncompanyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UseroncompanyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UseroncompanyGroupByArgs['orderBy'] }
        : { orderBy?: UseroncompanyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UseroncompanyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUseroncompanyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Useroncompany model
   */
  readonly fields: UseroncompanyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Useroncompany.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UseroncompanyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    User<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Useroncompany model
   */
  interface UseroncompanyFieldRefs {
    readonly id: FieldRef<"Useroncompany", 'Int'>
    readonly companyName: FieldRef<"Useroncompany", 'String'>
    readonly userId: FieldRef<"Useroncompany", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Useroncompany findUnique
   */
  export type UseroncompanyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Useroncompany
     */
    select?: UseroncompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Useroncompany
     */
    omit?: UseroncompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UseroncompanyInclude<ExtArgs> | null
    /**
     * Filter, which Useroncompany to fetch.
     */
    where: UseroncompanyWhereUniqueInput
  }

  /**
   * Useroncompany findUniqueOrThrow
   */
  export type UseroncompanyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Useroncompany
     */
    select?: UseroncompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Useroncompany
     */
    omit?: UseroncompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UseroncompanyInclude<ExtArgs> | null
    /**
     * Filter, which Useroncompany to fetch.
     */
    where: UseroncompanyWhereUniqueInput
  }

  /**
   * Useroncompany findFirst
   */
  export type UseroncompanyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Useroncompany
     */
    select?: UseroncompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Useroncompany
     */
    omit?: UseroncompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UseroncompanyInclude<ExtArgs> | null
    /**
     * Filter, which Useroncompany to fetch.
     */
    where?: UseroncompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Useroncompanies to fetch.
     */
    orderBy?: UseroncompanyOrderByWithRelationInput | UseroncompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Useroncompanies.
     */
    cursor?: UseroncompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Useroncompanies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Useroncompanies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Useroncompanies.
     */
    distinct?: UseroncompanyScalarFieldEnum | UseroncompanyScalarFieldEnum[]
  }

  /**
   * Useroncompany findFirstOrThrow
   */
  export type UseroncompanyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Useroncompany
     */
    select?: UseroncompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Useroncompany
     */
    omit?: UseroncompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UseroncompanyInclude<ExtArgs> | null
    /**
     * Filter, which Useroncompany to fetch.
     */
    where?: UseroncompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Useroncompanies to fetch.
     */
    orderBy?: UseroncompanyOrderByWithRelationInput | UseroncompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Useroncompanies.
     */
    cursor?: UseroncompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Useroncompanies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Useroncompanies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Useroncompanies.
     */
    distinct?: UseroncompanyScalarFieldEnum | UseroncompanyScalarFieldEnum[]
  }

  /**
   * Useroncompany findMany
   */
  export type UseroncompanyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Useroncompany
     */
    select?: UseroncompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Useroncompany
     */
    omit?: UseroncompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UseroncompanyInclude<ExtArgs> | null
    /**
     * Filter, which Useroncompanies to fetch.
     */
    where?: UseroncompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Useroncompanies to fetch.
     */
    orderBy?: UseroncompanyOrderByWithRelationInput | UseroncompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Useroncompanies.
     */
    cursor?: UseroncompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Useroncompanies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Useroncompanies.
     */
    skip?: number
    distinct?: UseroncompanyScalarFieldEnum | UseroncompanyScalarFieldEnum[]
  }

  /**
   * Useroncompany create
   */
  export type UseroncompanyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Useroncompany
     */
    select?: UseroncompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Useroncompany
     */
    omit?: UseroncompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UseroncompanyInclude<ExtArgs> | null
    /**
     * The data needed to create a Useroncompany.
     */
    data: XOR<UseroncompanyCreateInput, UseroncompanyUncheckedCreateInput>
  }

  /**
   * Useroncompany createMany
   */
  export type UseroncompanyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Useroncompanies.
     */
    data: UseroncompanyCreateManyInput | UseroncompanyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Useroncompany update
   */
  export type UseroncompanyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Useroncompany
     */
    select?: UseroncompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Useroncompany
     */
    omit?: UseroncompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UseroncompanyInclude<ExtArgs> | null
    /**
     * The data needed to update a Useroncompany.
     */
    data: XOR<UseroncompanyUpdateInput, UseroncompanyUncheckedUpdateInput>
    /**
     * Choose, which Useroncompany to update.
     */
    where: UseroncompanyWhereUniqueInput
  }

  /**
   * Useroncompany updateMany
   */
  export type UseroncompanyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Useroncompanies.
     */
    data: XOR<UseroncompanyUpdateManyMutationInput, UseroncompanyUncheckedUpdateManyInput>
    /**
     * Filter which Useroncompanies to update
     */
    where?: UseroncompanyWhereInput
    /**
     * Limit how many Useroncompanies to update.
     */
    limit?: number
  }

  /**
   * Useroncompany upsert
   */
  export type UseroncompanyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Useroncompany
     */
    select?: UseroncompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Useroncompany
     */
    omit?: UseroncompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UseroncompanyInclude<ExtArgs> | null
    /**
     * The filter to search for the Useroncompany to update in case it exists.
     */
    where: UseroncompanyWhereUniqueInput
    /**
     * In case the Useroncompany found by the `where` argument doesn't exist, create a new Useroncompany with this data.
     */
    create: XOR<UseroncompanyCreateInput, UseroncompanyUncheckedCreateInput>
    /**
     * In case the Useroncompany was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UseroncompanyUpdateInput, UseroncompanyUncheckedUpdateInput>
  }

  /**
   * Useroncompany delete
   */
  export type UseroncompanyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Useroncompany
     */
    select?: UseroncompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Useroncompany
     */
    omit?: UseroncompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UseroncompanyInclude<ExtArgs> | null
    /**
     * Filter which Useroncompany to delete.
     */
    where: UseroncompanyWhereUniqueInput
  }

  /**
   * Useroncompany deleteMany
   */
  export type UseroncompanyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Useroncompanies to delete
     */
    where?: UseroncompanyWhereInput
    /**
     * Limit how many Useroncompanies to delete.
     */
    limit?: number
  }

  /**
   * Useroncompany without action
   */
  export type UseroncompanyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Useroncompany
     */
    select?: UseroncompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Useroncompany
     */
    omit?: UseroncompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UseroncompanyInclude<ExtArgs> | null
  }


  /**
   * Model Useronpage
   */

  export type AggregateUseronpage = {
    _count: UseronpageCountAggregateOutputType | null
    _avg: UseronpageAvgAggregateOutputType | null
    _sum: UseronpageSumAggregateOutputType | null
    _min: UseronpageMinAggregateOutputType | null
    _max: UseronpageMaxAggregateOutputType | null
  }

  export type UseronpageAvgAggregateOutputType = {
    id: number | null
    roleId: number | null
    userId: number | null
  }

  export type UseronpageSumAggregateOutputType = {
    id: number | null
    roleId: number | null
    userId: number | null
  }

  export type UseronpageMinAggregateOutputType = {
    id: number | null
    roleId: number | null
    username: string | null
    active: boolean | null
    read: boolean | null
    create: boolean | null
    edit: boolean | null
    link: string | null
    delete: boolean | null
    isdefault: boolean | null
    userId: number | null
    check: string | null
  }

  export type UseronpageMaxAggregateOutputType = {
    id: number | null
    roleId: number | null
    username: string | null
    active: boolean | null
    read: boolean | null
    create: boolean | null
    edit: boolean | null
    link: string | null
    delete: boolean | null
    isdefault: boolean | null
    userId: number | null
    check: string | null
  }

  export type UseronpageCountAggregateOutputType = {
    id: number
    roleId: number
    username: number
    active: number
    read: number
    create: number
    edit: number
    link: number
    delete: number
    isdefault: number
    userId: number
    check: number
    _all: number
  }


  export type UseronpageAvgAggregateInputType = {
    id?: true
    roleId?: true
    userId?: true
  }

  export type UseronpageSumAggregateInputType = {
    id?: true
    roleId?: true
    userId?: true
  }

  export type UseronpageMinAggregateInputType = {
    id?: true
    roleId?: true
    username?: true
    active?: true
    read?: true
    create?: true
    edit?: true
    link?: true
    delete?: true
    isdefault?: true
    userId?: true
    check?: true
  }

  export type UseronpageMaxAggregateInputType = {
    id?: true
    roleId?: true
    username?: true
    active?: true
    read?: true
    create?: true
    edit?: true
    link?: true
    delete?: true
    isdefault?: true
    userId?: true
    check?: true
  }

  export type UseronpageCountAggregateInputType = {
    id?: true
    roleId?: true
    username?: true
    active?: true
    read?: true
    create?: true
    edit?: true
    link?: true
    delete?: true
    isdefault?: true
    userId?: true
    check?: true
    _all?: true
  }

  export type UseronpageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Useronpage to aggregate.
     */
    where?: UseronpageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Useronpages to fetch.
     */
    orderBy?: UseronpageOrderByWithRelationInput | UseronpageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UseronpageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Useronpages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Useronpages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Useronpages
    **/
    _count?: true | UseronpageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UseronpageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UseronpageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UseronpageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UseronpageMaxAggregateInputType
  }

  export type GetUseronpageAggregateType<T extends UseronpageAggregateArgs> = {
        [P in keyof T & keyof AggregateUseronpage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUseronpage[P]>
      : GetScalarType<T[P], AggregateUseronpage[P]>
  }




  export type UseronpageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UseronpageWhereInput
    orderBy?: UseronpageOrderByWithAggregationInput | UseronpageOrderByWithAggregationInput[]
    by: UseronpageScalarFieldEnum[] | UseronpageScalarFieldEnum
    having?: UseronpageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UseronpageCountAggregateInputType | true
    _avg?: UseronpageAvgAggregateInputType
    _sum?: UseronpageSumAggregateInputType
    _min?: UseronpageMinAggregateInputType
    _max?: UseronpageMaxAggregateInputType
  }

  export type UseronpageGroupByOutputType = {
    id: number
    roleId: number | null
    username: string | null
    active: boolean | null
    read: boolean | null
    create: boolean | null
    edit: boolean | null
    link: string | null
    delete: boolean | null
    isdefault: boolean | null
    userId: number
    check: string | null
    _count: UseronpageCountAggregateOutputType | null
    _avg: UseronpageAvgAggregateOutputType | null
    _sum: UseronpageSumAggregateOutputType | null
    _min: UseronpageMinAggregateOutputType | null
    _max: UseronpageMaxAggregateOutputType | null
  }

  type GetUseronpageGroupByPayload<T extends UseronpageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UseronpageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UseronpageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UseronpageGroupByOutputType[P]>
            : GetScalarType<T[P], UseronpageGroupByOutputType[P]>
        }
      >
    >


  export type UseronpageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roleId?: boolean
    username?: boolean
    active?: boolean
    read?: boolean
    create?: boolean
    edit?: boolean
    link?: boolean
    delete?: boolean
    isdefault?: boolean
    userId?: boolean
    check?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["useronpage"]>



  export type UseronpageSelectScalar = {
    id?: boolean
    roleId?: boolean
    username?: boolean
    active?: boolean
    read?: boolean
    create?: boolean
    edit?: boolean
    link?: boolean
    delete?: boolean
    isdefault?: boolean
    userId?: boolean
    check?: boolean
  }

  export type UseronpageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "roleId" | "username" | "active" | "read" | "create" | "edit" | "link" | "delete" | "isdefault" | "userId" | "check", ExtArgs["result"]["useronpage"]>
  export type UseronpageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UseronpagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Useronpage"
    objects: {
      User: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      roleId: number | null
      username: string | null
      active: boolean | null
      read: boolean | null
      create: boolean | null
      edit: boolean | null
      link: string | null
      delete: boolean | null
      isdefault: boolean | null
      userId: number
      check: string | null
    }, ExtArgs["result"]["useronpage"]>
    composites: {}
  }

  type UseronpageGetPayload<S extends boolean | null | undefined | UseronpageDefaultArgs> = $Result.GetResult<Prisma.$UseronpagePayload, S>

  type UseronpageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UseronpageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UseronpageCountAggregateInputType | true
    }

  export interface UseronpageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Useronpage'], meta: { name: 'Useronpage' } }
    /**
     * Find zero or one Useronpage that matches the filter.
     * @param {UseronpageFindUniqueArgs} args - Arguments to find a Useronpage
     * @example
     * // Get one Useronpage
     * const useronpage = await prisma.useronpage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UseronpageFindUniqueArgs>(args: SelectSubset<T, UseronpageFindUniqueArgs<ExtArgs>>): Prisma__UseronpageClient<$Result.GetResult<Prisma.$UseronpagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Useronpage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UseronpageFindUniqueOrThrowArgs} args - Arguments to find a Useronpage
     * @example
     * // Get one Useronpage
     * const useronpage = await prisma.useronpage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UseronpageFindUniqueOrThrowArgs>(args: SelectSubset<T, UseronpageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UseronpageClient<$Result.GetResult<Prisma.$UseronpagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Useronpage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UseronpageFindFirstArgs} args - Arguments to find a Useronpage
     * @example
     * // Get one Useronpage
     * const useronpage = await prisma.useronpage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UseronpageFindFirstArgs>(args?: SelectSubset<T, UseronpageFindFirstArgs<ExtArgs>>): Prisma__UseronpageClient<$Result.GetResult<Prisma.$UseronpagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Useronpage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UseronpageFindFirstOrThrowArgs} args - Arguments to find a Useronpage
     * @example
     * // Get one Useronpage
     * const useronpage = await prisma.useronpage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UseronpageFindFirstOrThrowArgs>(args?: SelectSubset<T, UseronpageFindFirstOrThrowArgs<ExtArgs>>): Prisma__UseronpageClient<$Result.GetResult<Prisma.$UseronpagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Useronpages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UseronpageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Useronpages
     * const useronpages = await prisma.useronpage.findMany()
     * 
     * // Get first 10 Useronpages
     * const useronpages = await prisma.useronpage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const useronpageWithIdOnly = await prisma.useronpage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UseronpageFindManyArgs>(args?: SelectSubset<T, UseronpageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UseronpagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Useronpage.
     * @param {UseronpageCreateArgs} args - Arguments to create a Useronpage.
     * @example
     * // Create one Useronpage
     * const Useronpage = await prisma.useronpage.create({
     *   data: {
     *     // ... data to create a Useronpage
     *   }
     * })
     * 
     */
    create<T extends UseronpageCreateArgs>(args: SelectSubset<T, UseronpageCreateArgs<ExtArgs>>): Prisma__UseronpageClient<$Result.GetResult<Prisma.$UseronpagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Useronpages.
     * @param {UseronpageCreateManyArgs} args - Arguments to create many Useronpages.
     * @example
     * // Create many Useronpages
     * const useronpage = await prisma.useronpage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UseronpageCreateManyArgs>(args?: SelectSubset<T, UseronpageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Useronpage.
     * @param {UseronpageDeleteArgs} args - Arguments to delete one Useronpage.
     * @example
     * // Delete one Useronpage
     * const Useronpage = await prisma.useronpage.delete({
     *   where: {
     *     // ... filter to delete one Useronpage
     *   }
     * })
     * 
     */
    delete<T extends UseronpageDeleteArgs>(args: SelectSubset<T, UseronpageDeleteArgs<ExtArgs>>): Prisma__UseronpageClient<$Result.GetResult<Prisma.$UseronpagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Useronpage.
     * @param {UseronpageUpdateArgs} args - Arguments to update one Useronpage.
     * @example
     * // Update one Useronpage
     * const useronpage = await prisma.useronpage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UseronpageUpdateArgs>(args: SelectSubset<T, UseronpageUpdateArgs<ExtArgs>>): Prisma__UseronpageClient<$Result.GetResult<Prisma.$UseronpagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Useronpages.
     * @param {UseronpageDeleteManyArgs} args - Arguments to filter Useronpages to delete.
     * @example
     * // Delete a few Useronpages
     * const { count } = await prisma.useronpage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UseronpageDeleteManyArgs>(args?: SelectSubset<T, UseronpageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Useronpages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UseronpageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Useronpages
     * const useronpage = await prisma.useronpage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UseronpageUpdateManyArgs>(args: SelectSubset<T, UseronpageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Useronpage.
     * @param {UseronpageUpsertArgs} args - Arguments to update or create a Useronpage.
     * @example
     * // Update or create a Useronpage
     * const useronpage = await prisma.useronpage.upsert({
     *   create: {
     *     // ... data to create a Useronpage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Useronpage we want to update
     *   }
     * })
     */
    upsert<T extends UseronpageUpsertArgs>(args: SelectSubset<T, UseronpageUpsertArgs<ExtArgs>>): Prisma__UseronpageClient<$Result.GetResult<Prisma.$UseronpagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Useronpages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UseronpageCountArgs} args - Arguments to filter Useronpages to count.
     * @example
     * // Count the number of Useronpages
     * const count = await prisma.useronpage.count({
     *   where: {
     *     // ... the filter for the Useronpages we want to count
     *   }
     * })
    **/
    count<T extends UseronpageCountArgs>(
      args?: Subset<T, UseronpageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UseronpageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Useronpage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UseronpageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UseronpageAggregateArgs>(args: Subset<T, UseronpageAggregateArgs>): Prisma.PrismaPromise<GetUseronpageAggregateType<T>>

    /**
     * Group by Useronpage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UseronpageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UseronpageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UseronpageGroupByArgs['orderBy'] }
        : { orderBy?: UseronpageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UseronpageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUseronpageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Useronpage model
   */
  readonly fields: UseronpageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Useronpage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UseronpageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    User<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Useronpage model
   */
  interface UseronpageFieldRefs {
    readonly id: FieldRef<"Useronpage", 'Int'>
    readonly roleId: FieldRef<"Useronpage", 'Int'>
    readonly username: FieldRef<"Useronpage", 'String'>
    readonly active: FieldRef<"Useronpage", 'Boolean'>
    readonly read: FieldRef<"Useronpage", 'Boolean'>
    readonly create: FieldRef<"Useronpage", 'Boolean'>
    readonly edit: FieldRef<"Useronpage", 'Boolean'>
    readonly link: FieldRef<"Useronpage", 'String'>
    readonly delete: FieldRef<"Useronpage", 'Boolean'>
    readonly isdefault: FieldRef<"Useronpage", 'Boolean'>
    readonly userId: FieldRef<"Useronpage", 'Int'>
    readonly check: FieldRef<"Useronpage", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Useronpage findUnique
   */
  export type UseronpageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Useronpage
     */
    select?: UseronpageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Useronpage
     */
    omit?: UseronpageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UseronpageInclude<ExtArgs> | null
    /**
     * Filter, which Useronpage to fetch.
     */
    where: UseronpageWhereUniqueInput
  }

  /**
   * Useronpage findUniqueOrThrow
   */
  export type UseronpageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Useronpage
     */
    select?: UseronpageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Useronpage
     */
    omit?: UseronpageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UseronpageInclude<ExtArgs> | null
    /**
     * Filter, which Useronpage to fetch.
     */
    where: UseronpageWhereUniqueInput
  }

  /**
   * Useronpage findFirst
   */
  export type UseronpageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Useronpage
     */
    select?: UseronpageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Useronpage
     */
    omit?: UseronpageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UseronpageInclude<ExtArgs> | null
    /**
     * Filter, which Useronpage to fetch.
     */
    where?: UseronpageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Useronpages to fetch.
     */
    orderBy?: UseronpageOrderByWithRelationInput | UseronpageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Useronpages.
     */
    cursor?: UseronpageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Useronpages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Useronpages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Useronpages.
     */
    distinct?: UseronpageScalarFieldEnum | UseronpageScalarFieldEnum[]
  }

  /**
   * Useronpage findFirstOrThrow
   */
  export type UseronpageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Useronpage
     */
    select?: UseronpageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Useronpage
     */
    omit?: UseronpageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UseronpageInclude<ExtArgs> | null
    /**
     * Filter, which Useronpage to fetch.
     */
    where?: UseronpageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Useronpages to fetch.
     */
    orderBy?: UseronpageOrderByWithRelationInput | UseronpageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Useronpages.
     */
    cursor?: UseronpageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Useronpages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Useronpages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Useronpages.
     */
    distinct?: UseronpageScalarFieldEnum | UseronpageScalarFieldEnum[]
  }

  /**
   * Useronpage findMany
   */
  export type UseronpageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Useronpage
     */
    select?: UseronpageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Useronpage
     */
    omit?: UseronpageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UseronpageInclude<ExtArgs> | null
    /**
     * Filter, which Useronpages to fetch.
     */
    where?: UseronpageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Useronpages to fetch.
     */
    orderBy?: UseronpageOrderByWithRelationInput | UseronpageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Useronpages.
     */
    cursor?: UseronpageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Useronpages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Useronpages.
     */
    skip?: number
    distinct?: UseronpageScalarFieldEnum | UseronpageScalarFieldEnum[]
  }

  /**
   * Useronpage create
   */
  export type UseronpageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Useronpage
     */
    select?: UseronpageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Useronpage
     */
    omit?: UseronpageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UseronpageInclude<ExtArgs> | null
    /**
     * The data needed to create a Useronpage.
     */
    data: XOR<UseronpageCreateInput, UseronpageUncheckedCreateInput>
  }

  /**
   * Useronpage createMany
   */
  export type UseronpageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Useronpages.
     */
    data: UseronpageCreateManyInput | UseronpageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Useronpage update
   */
  export type UseronpageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Useronpage
     */
    select?: UseronpageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Useronpage
     */
    omit?: UseronpageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UseronpageInclude<ExtArgs> | null
    /**
     * The data needed to update a Useronpage.
     */
    data: XOR<UseronpageUpdateInput, UseronpageUncheckedUpdateInput>
    /**
     * Choose, which Useronpage to update.
     */
    where: UseronpageWhereUniqueInput
  }

  /**
   * Useronpage updateMany
   */
  export type UseronpageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Useronpages.
     */
    data: XOR<UseronpageUpdateManyMutationInput, UseronpageUncheckedUpdateManyInput>
    /**
     * Filter which Useronpages to update
     */
    where?: UseronpageWhereInput
    /**
     * Limit how many Useronpages to update.
     */
    limit?: number
  }

  /**
   * Useronpage upsert
   */
  export type UseronpageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Useronpage
     */
    select?: UseronpageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Useronpage
     */
    omit?: UseronpageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UseronpageInclude<ExtArgs> | null
    /**
     * The filter to search for the Useronpage to update in case it exists.
     */
    where: UseronpageWhereUniqueInput
    /**
     * In case the Useronpage found by the `where` argument doesn't exist, create a new Useronpage with this data.
     */
    create: XOR<UseronpageCreateInput, UseronpageUncheckedCreateInput>
    /**
     * In case the Useronpage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UseronpageUpdateInput, UseronpageUncheckedUpdateInput>
  }

  /**
   * Useronpage delete
   */
  export type UseronpageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Useronpage
     */
    select?: UseronpageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Useronpage
     */
    omit?: UseronpageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UseronpageInclude<ExtArgs> | null
    /**
     * Filter which Useronpage to delete.
     */
    where: UseronpageWhereUniqueInput
  }

  /**
   * Useronpage deleteMany
   */
  export type UseronpageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Useronpages to delete
     */
    where?: UseronpageWhereInput
    /**
     * Limit how many Useronpages to delete.
     */
    limit?: number
  }

  /**
   * Useronpage without action
   */
  export type UseronpageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Useronpage
     */
    select?: UseronpageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Useronpage
     */
    omit?: UseronpageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UseronpageInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const RoleScalarFieldEnum: {
    id: 'id',
    rolename: 'rolename',
    active: 'active'
  };

  export type RoleScalarFieldEnum = (typeof RoleScalarFieldEnum)[keyof typeof RoleScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    roleId: 'roleId',
    username: 'username',
    employeeId: 'employeeId',
    active: 'active',
    password: 'password',
    comCode: 'comCode'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const UseroncompanyScalarFieldEnum: {
    id: 'id',
    companyName: 'companyName',
    userId: 'userId'
  };

  export type UseroncompanyScalarFieldEnum = (typeof UseroncompanyScalarFieldEnum)[keyof typeof UseroncompanyScalarFieldEnum]


  export const UseronpageScalarFieldEnum: {
    id: 'id',
    roleId: 'roleId',
    username: 'username',
    active: 'active',
    read: 'read',
    create: 'create',
    edit: 'edit',
    link: 'link',
    delete: 'delete',
    isdefault: 'isdefault',
    userId: 'userId',
    check: 'check'
  };

  export type UseronpageScalarFieldEnum = (typeof UseronpageScalarFieldEnum)[keyof typeof UseronpageScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const RoleOrderByRelevanceFieldEnum: {
    rolename: 'rolename'
  };

  export type RoleOrderByRelevanceFieldEnum = (typeof RoleOrderByRelevanceFieldEnum)[keyof typeof RoleOrderByRelevanceFieldEnum]


  export const UserOrderByRelevanceFieldEnum: {
    username: 'username',
    password: 'password',
    comCode: 'comCode'
  };

  export type UserOrderByRelevanceFieldEnum = (typeof UserOrderByRelevanceFieldEnum)[keyof typeof UserOrderByRelevanceFieldEnum]


  export const UseroncompanyOrderByRelevanceFieldEnum: {
    companyName: 'companyName'
  };

  export type UseroncompanyOrderByRelevanceFieldEnum = (typeof UseroncompanyOrderByRelevanceFieldEnum)[keyof typeof UseroncompanyOrderByRelevanceFieldEnum]


  export const UseronpageOrderByRelevanceFieldEnum: {
    username: 'username',
    link: 'link',
    check: 'check'
  };

  export type UseronpageOrderByRelevanceFieldEnum = (typeof UseronpageOrderByRelevanceFieldEnum)[keyof typeof UseronpageOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type RoleWhereInput = {
    AND?: RoleWhereInput | RoleWhereInput[]
    OR?: RoleWhereInput[]
    NOT?: RoleWhereInput | RoleWhereInput[]
    id?: IntFilter<"Role"> | number
    rolename?: StringNullableFilter<"Role"> | string | null
    active?: BoolNullableFilter<"Role"> | boolean | null
  }

  export type RoleOrderByWithRelationInput = {
    id?: SortOrder
    rolename?: SortOrderInput | SortOrder
    active?: SortOrderInput | SortOrder
    _relevance?: RoleOrderByRelevanceInput
  }

  export type RoleWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    rolename?: string
    AND?: RoleWhereInput | RoleWhereInput[]
    OR?: RoleWhereInput[]
    NOT?: RoleWhereInput | RoleWhereInput[]
    active?: BoolNullableFilter<"Role"> | boolean | null
  }, "id" | "rolename">

  export type RoleOrderByWithAggregationInput = {
    id?: SortOrder
    rolename?: SortOrderInput | SortOrder
    active?: SortOrderInput | SortOrder
    _count?: RoleCountOrderByAggregateInput
    _avg?: RoleAvgOrderByAggregateInput
    _max?: RoleMaxOrderByAggregateInput
    _min?: RoleMinOrderByAggregateInput
    _sum?: RoleSumOrderByAggregateInput
  }

  export type RoleScalarWhereWithAggregatesInput = {
    AND?: RoleScalarWhereWithAggregatesInput | RoleScalarWhereWithAggregatesInput[]
    OR?: RoleScalarWhereWithAggregatesInput[]
    NOT?: RoleScalarWhereWithAggregatesInput | RoleScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Role"> | number
    rolename?: StringNullableWithAggregatesFilter<"Role"> | string | null
    active?: BoolNullableWithAggregatesFilter<"Role"> | boolean | null
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    roleId?: IntNullableFilter<"User"> | number | null
    username?: StringNullableFilter<"User"> | string | null
    employeeId?: IntNullableFilter<"User"> | number | null
    active?: BoolNullableFilter<"User"> | boolean | null
    password?: StringNullableFilter<"User"> | string | null
    comCode?: StringNullableFilter<"User"> | string | null
    Useronpage?: UseronpageListRelationFilter
    Useroncompany?: UseroncompanyListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    roleId?: SortOrderInput | SortOrder
    username?: SortOrderInput | SortOrder
    employeeId?: SortOrderInput | SortOrder
    active?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    comCode?: SortOrderInput | SortOrder
    Useronpage?: UseronpageOrderByRelationAggregateInput
    Useroncompany?: UseroncompanyOrderByRelationAggregateInput
    _relevance?: UserOrderByRelevanceInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    username?: string
    employeeId?: number
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    roleId?: IntNullableFilter<"User"> | number | null
    active?: BoolNullableFilter<"User"> | boolean | null
    password?: StringNullableFilter<"User"> | string | null
    comCode?: StringNullableFilter<"User"> | string | null
    Useronpage?: UseronpageListRelationFilter
    Useroncompany?: UseroncompanyListRelationFilter
  }, "id" | "username" | "employeeId">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    roleId?: SortOrderInput | SortOrder
    username?: SortOrderInput | SortOrder
    employeeId?: SortOrderInput | SortOrder
    active?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    comCode?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    roleId?: IntNullableWithAggregatesFilter<"User"> | number | null
    username?: StringNullableWithAggregatesFilter<"User"> | string | null
    employeeId?: IntNullableWithAggregatesFilter<"User"> | number | null
    active?: BoolNullableWithAggregatesFilter<"User"> | boolean | null
    password?: StringNullableWithAggregatesFilter<"User"> | string | null
    comCode?: StringNullableWithAggregatesFilter<"User"> | string | null
  }

  export type UseroncompanyWhereInput = {
    AND?: UseroncompanyWhereInput | UseroncompanyWhereInput[]
    OR?: UseroncompanyWhereInput[]
    NOT?: UseroncompanyWhereInput | UseroncompanyWhereInput[]
    id?: IntFilter<"Useroncompany"> | number
    companyName?: StringNullableFilter<"Useroncompany"> | string | null
    userId?: IntFilter<"Useroncompany"> | number
    User?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type UseroncompanyOrderByWithRelationInput = {
    id?: SortOrder
    companyName?: SortOrderInput | SortOrder
    userId?: SortOrder
    User?: UserOrderByWithRelationInput
    _relevance?: UseroncompanyOrderByRelevanceInput
  }

  export type UseroncompanyWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: UseroncompanyWhereInput | UseroncompanyWhereInput[]
    OR?: UseroncompanyWhereInput[]
    NOT?: UseroncompanyWhereInput | UseroncompanyWhereInput[]
    companyName?: StringNullableFilter<"Useroncompany"> | string | null
    userId?: IntFilter<"Useroncompany"> | number
    User?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type UseroncompanyOrderByWithAggregationInput = {
    id?: SortOrder
    companyName?: SortOrderInput | SortOrder
    userId?: SortOrder
    _count?: UseroncompanyCountOrderByAggregateInput
    _avg?: UseroncompanyAvgOrderByAggregateInput
    _max?: UseroncompanyMaxOrderByAggregateInput
    _min?: UseroncompanyMinOrderByAggregateInput
    _sum?: UseroncompanySumOrderByAggregateInput
  }

  export type UseroncompanyScalarWhereWithAggregatesInput = {
    AND?: UseroncompanyScalarWhereWithAggregatesInput | UseroncompanyScalarWhereWithAggregatesInput[]
    OR?: UseroncompanyScalarWhereWithAggregatesInput[]
    NOT?: UseroncompanyScalarWhereWithAggregatesInput | UseroncompanyScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Useroncompany"> | number
    companyName?: StringNullableWithAggregatesFilter<"Useroncompany"> | string | null
    userId?: IntWithAggregatesFilter<"Useroncompany"> | number
  }

  export type UseronpageWhereInput = {
    AND?: UseronpageWhereInput | UseronpageWhereInput[]
    OR?: UseronpageWhereInput[]
    NOT?: UseronpageWhereInput | UseronpageWhereInput[]
    id?: IntFilter<"Useronpage"> | number
    roleId?: IntNullableFilter<"Useronpage"> | number | null
    username?: StringNullableFilter<"Useronpage"> | string | null
    active?: BoolNullableFilter<"Useronpage"> | boolean | null
    read?: BoolNullableFilter<"Useronpage"> | boolean | null
    create?: BoolNullableFilter<"Useronpage"> | boolean | null
    edit?: BoolNullableFilter<"Useronpage"> | boolean | null
    link?: StringNullableFilter<"Useronpage"> | string | null
    delete?: BoolNullableFilter<"Useronpage"> | boolean | null
    isdefault?: BoolNullableFilter<"Useronpage"> | boolean | null
    userId?: IntFilter<"Useronpage"> | number
    check?: StringNullableFilter<"Useronpage"> | string | null
    User?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type UseronpageOrderByWithRelationInput = {
    id?: SortOrder
    roleId?: SortOrderInput | SortOrder
    username?: SortOrderInput | SortOrder
    active?: SortOrderInput | SortOrder
    read?: SortOrderInput | SortOrder
    create?: SortOrderInput | SortOrder
    edit?: SortOrderInput | SortOrder
    link?: SortOrderInput | SortOrder
    delete?: SortOrderInput | SortOrder
    isdefault?: SortOrderInput | SortOrder
    userId?: SortOrder
    check?: SortOrderInput | SortOrder
    User?: UserOrderByWithRelationInput
    _relevance?: UseronpageOrderByRelevanceInput
  }

  export type UseronpageWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: UseronpageWhereInput | UseronpageWhereInput[]
    OR?: UseronpageWhereInput[]
    NOT?: UseronpageWhereInput | UseronpageWhereInput[]
    roleId?: IntNullableFilter<"Useronpage"> | number | null
    username?: StringNullableFilter<"Useronpage"> | string | null
    active?: BoolNullableFilter<"Useronpage"> | boolean | null
    read?: BoolNullableFilter<"Useronpage"> | boolean | null
    create?: BoolNullableFilter<"Useronpage"> | boolean | null
    edit?: BoolNullableFilter<"Useronpage"> | boolean | null
    link?: StringNullableFilter<"Useronpage"> | string | null
    delete?: BoolNullableFilter<"Useronpage"> | boolean | null
    isdefault?: BoolNullableFilter<"Useronpage"> | boolean | null
    userId?: IntFilter<"Useronpage"> | number
    check?: StringNullableFilter<"Useronpage"> | string | null
    User?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type UseronpageOrderByWithAggregationInput = {
    id?: SortOrder
    roleId?: SortOrderInput | SortOrder
    username?: SortOrderInput | SortOrder
    active?: SortOrderInput | SortOrder
    read?: SortOrderInput | SortOrder
    create?: SortOrderInput | SortOrder
    edit?: SortOrderInput | SortOrder
    link?: SortOrderInput | SortOrder
    delete?: SortOrderInput | SortOrder
    isdefault?: SortOrderInput | SortOrder
    userId?: SortOrder
    check?: SortOrderInput | SortOrder
    _count?: UseronpageCountOrderByAggregateInput
    _avg?: UseronpageAvgOrderByAggregateInput
    _max?: UseronpageMaxOrderByAggregateInput
    _min?: UseronpageMinOrderByAggregateInput
    _sum?: UseronpageSumOrderByAggregateInput
  }

  export type UseronpageScalarWhereWithAggregatesInput = {
    AND?: UseronpageScalarWhereWithAggregatesInput | UseronpageScalarWhereWithAggregatesInput[]
    OR?: UseronpageScalarWhereWithAggregatesInput[]
    NOT?: UseronpageScalarWhereWithAggregatesInput | UseronpageScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Useronpage"> | number
    roleId?: IntNullableWithAggregatesFilter<"Useronpage"> | number | null
    username?: StringNullableWithAggregatesFilter<"Useronpage"> | string | null
    active?: BoolNullableWithAggregatesFilter<"Useronpage"> | boolean | null
    read?: BoolNullableWithAggregatesFilter<"Useronpage"> | boolean | null
    create?: BoolNullableWithAggregatesFilter<"Useronpage"> | boolean | null
    edit?: BoolNullableWithAggregatesFilter<"Useronpage"> | boolean | null
    link?: StringNullableWithAggregatesFilter<"Useronpage"> | string | null
    delete?: BoolNullableWithAggregatesFilter<"Useronpage"> | boolean | null
    isdefault?: BoolNullableWithAggregatesFilter<"Useronpage"> | boolean | null
    userId?: IntWithAggregatesFilter<"Useronpage"> | number
    check?: StringNullableWithAggregatesFilter<"Useronpage"> | string | null
  }

  export type RoleCreateInput = {
    rolename?: string | null
    active?: boolean | null
  }

  export type RoleUncheckedCreateInput = {
    id?: number
    rolename?: string | null
    active?: boolean | null
  }

  export type RoleUpdateInput = {
    rolename?: NullableStringFieldUpdateOperationsInput | string | null
    active?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type RoleUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    rolename?: NullableStringFieldUpdateOperationsInput | string | null
    active?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type RoleCreateManyInput = {
    id?: number
    rolename?: string | null
    active?: boolean | null
  }

  export type RoleUpdateManyMutationInput = {
    rolename?: NullableStringFieldUpdateOperationsInput | string | null
    active?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type RoleUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    rolename?: NullableStringFieldUpdateOperationsInput | string | null
    active?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type UserCreateInput = {
    roleId?: number | null
    username?: string | null
    employeeId?: number | null
    active?: boolean | null
    password?: string | null
    comCode?: string | null
    Useronpage?: UseronpageCreateNestedManyWithoutUserInput
    Useroncompany?: UseroncompanyCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    roleId?: number | null
    username?: string | null
    employeeId?: number | null
    active?: boolean | null
    password?: string | null
    comCode?: string | null
    Useronpage?: UseronpageUncheckedCreateNestedManyWithoutUserInput
    Useroncompany?: UseroncompanyUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    roleId?: NullableIntFieldUpdateOperationsInput | number | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    employeeId?: NullableIntFieldUpdateOperationsInput | number | null
    active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    comCode?: NullableStringFieldUpdateOperationsInput | string | null
    Useronpage?: UseronpageUpdateManyWithoutUserNestedInput
    Useroncompany?: UseroncompanyUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    roleId?: NullableIntFieldUpdateOperationsInput | number | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    employeeId?: NullableIntFieldUpdateOperationsInput | number | null
    active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    comCode?: NullableStringFieldUpdateOperationsInput | string | null
    Useronpage?: UseronpageUncheckedUpdateManyWithoutUserNestedInput
    Useroncompany?: UseroncompanyUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    roleId?: number | null
    username?: string | null
    employeeId?: number | null
    active?: boolean | null
    password?: string | null
    comCode?: string | null
  }

  export type UserUpdateManyMutationInput = {
    roleId?: NullableIntFieldUpdateOperationsInput | number | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    employeeId?: NullableIntFieldUpdateOperationsInput | number | null
    active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    comCode?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    roleId?: NullableIntFieldUpdateOperationsInput | number | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    employeeId?: NullableIntFieldUpdateOperationsInput | number | null
    active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    comCode?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UseroncompanyCreateInput = {
    companyName?: string | null
    User: UserCreateNestedOneWithoutUseroncompanyInput
  }

  export type UseroncompanyUncheckedCreateInput = {
    id?: number
    companyName?: string | null
    userId: number
  }

  export type UseroncompanyUpdateInput = {
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    User?: UserUpdateOneRequiredWithoutUseroncompanyNestedInput
  }

  export type UseroncompanyUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: IntFieldUpdateOperationsInput | number
  }

  export type UseroncompanyCreateManyInput = {
    id?: number
    companyName?: string | null
    userId: number
  }

  export type UseroncompanyUpdateManyMutationInput = {
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UseroncompanyUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: IntFieldUpdateOperationsInput | number
  }

  export type UseronpageCreateInput = {
    roleId?: number | null
    username?: string | null
    active?: boolean | null
    read?: boolean | null
    create?: boolean | null
    edit?: boolean | null
    link?: string | null
    delete?: boolean | null
    isdefault?: boolean | null
    check?: string | null
    User: UserCreateNestedOneWithoutUseronpageInput
  }

  export type UseronpageUncheckedCreateInput = {
    id?: number
    roleId?: number | null
    username?: string | null
    active?: boolean | null
    read?: boolean | null
    create?: boolean | null
    edit?: boolean | null
    link?: string | null
    delete?: boolean | null
    isdefault?: boolean | null
    userId: number
    check?: string | null
  }

  export type UseronpageUpdateInput = {
    roleId?: NullableIntFieldUpdateOperationsInput | number | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    read?: NullableBoolFieldUpdateOperationsInput | boolean | null
    create?: NullableBoolFieldUpdateOperationsInput | boolean | null
    edit?: NullableBoolFieldUpdateOperationsInput | boolean | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    delete?: NullableBoolFieldUpdateOperationsInput | boolean | null
    isdefault?: NullableBoolFieldUpdateOperationsInput | boolean | null
    check?: NullableStringFieldUpdateOperationsInput | string | null
    User?: UserUpdateOneRequiredWithoutUseronpageNestedInput
  }

  export type UseronpageUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    roleId?: NullableIntFieldUpdateOperationsInput | number | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    read?: NullableBoolFieldUpdateOperationsInput | boolean | null
    create?: NullableBoolFieldUpdateOperationsInput | boolean | null
    edit?: NullableBoolFieldUpdateOperationsInput | boolean | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    delete?: NullableBoolFieldUpdateOperationsInput | boolean | null
    isdefault?: NullableBoolFieldUpdateOperationsInput | boolean | null
    userId?: IntFieldUpdateOperationsInput | number
    check?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UseronpageCreateManyInput = {
    id?: number
    roleId?: number | null
    username?: string | null
    active?: boolean | null
    read?: boolean | null
    create?: boolean | null
    edit?: boolean | null
    link?: string | null
    delete?: boolean | null
    isdefault?: boolean | null
    userId: number
    check?: string | null
  }

  export type UseronpageUpdateManyMutationInput = {
    roleId?: NullableIntFieldUpdateOperationsInput | number | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    read?: NullableBoolFieldUpdateOperationsInput | boolean | null
    create?: NullableBoolFieldUpdateOperationsInput | boolean | null
    edit?: NullableBoolFieldUpdateOperationsInput | boolean | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    delete?: NullableBoolFieldUpdateOperationsInput | boolean | null
    isdefault?: NullableBoolFieldUpdateOperationsInput | boolean | null
    check?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UseronpageUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    roleId?: NullableIntFieldUpdateOperationsInput | number | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    read?: NullableBoolFieldUpdateOperationsInput | boolean | null
    create?: NullableBoolFieldUpdateOperationsInput | boolean | null
    edit?: NullableBoolFieldUpdateOperationsInput | boolean | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    delete?: NullableBoolFieldUpdateOperationsInput | boolean | null
    isdefault?: NullableBoolFieldUpdateOperationsInput | boolean | null
    userId?: IntFieldUpdateOperationsInput | number
    check?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type RoleOrderByRelevanceInput = {
    fields: RoleOrderByRelevanceFieldEnum | RoleOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type RoleCountOrderByAggregateInput = {
    id?: SortOrder
    rolename?: SortOrder
    active?: SortOrder
  }

  export type RoleAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type RoleMaxOrderByAggregateInput = {
    id?: SortOrder
    rolename?: SortOrder
    active?: SortOrder
  }

  export type RoleMinOrderByAggregateInput = {
    id?: SortOrder
    rolename?: SortOrder
    active?: SortOrder
  }

  export type RoleSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type UseronpageListRelationFilter = {
    every?: UseronpageWhereInput
    some?: UseronpageWhereInput
    none?: UseronpageWhereInput
  }

  export type UseroncompanyListRelationFilter = {
    every?: UseroncompanyWhereInput
    some?: UseroncompanyWhereInput
    none?: UseroncompanyWhereInput
  }

  export type UseronpageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UseroncompanyOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserOrderByRelevanceInput = {
    fields: UserOrderByRelevanceFieldEnum | UserOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    roleId?: SortOrder
    username?: SortOrder
    employeeId?: SortOrder
    active?: SortOrder
    password?: SortOrder
    comCode?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
    roleId?: SortOrder
    employeeId?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    roleId?: SortOrder
    username?: SortOrder
    employeeId?: SortOrder
    active?: SortOrder
    password?: SortOrder
    comCode?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    roleId?: SortOrder
    username?: SortOrder
    employeeId?: SortOrder
    active?: SortOrder
    password?: SortOrder
    comCode?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
    roleId?: SortOrder
    employeeId?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type UseroncompanyOrderByRelevanceInput = {
    fields: UseroncompanyOrderByRelevanceFieldEnum | UseroncompanyOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type UseroncompanyCountOrderByAggregateInput = {
    id?: SortOrder
    companyName?: SortOrder
    userId?: SortOrder
  }

  export type UseroncompanyAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type UseroncompanyMaxOrderByAggregateInput = {
    id?: SortOrder
    companyName?: SortOrder
    userId?: SortOrder
  }

  export type UseroncompanyMinOrderByAggregateInput = {
    id?: SortOrder
    companyName?: SortOrder
    userId?: SortOrder
  }

  export type UseroncompanySumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type UseronpageOrderByRelevanceInput = {
    fields: UseronpageOrderByRelevanceFieldEnum | UseronpageOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type UseronpageCountOrderByAggregateInput = {
    id?: SortOrder
    roleId?: SortOrder
    username?: SortOrder
    active?: SortOrder
    read?: SortOrder
    create?: SortOrder
    edit?: SortOrder
    link?: SortOrder
    delete?: SortOrder
    isdefault?: SortOrder
    userId?: SortOrder
    check?: SortOrder
  }

  export type UseronpageAvgOrderByAggregateInput = {
    id?: SortOrder
    roleId?: SortOrder
    userId?: SortOrder
  }

  export type UseronpageMaxOrderByAggregateInput = {
    id?: SortOrder
    roleId?: SortOrder
    username?: SortOrder
    active?: SortOrder
    read?: SortOrder
    create?: SortOrder
    edit?: SortOrder
    link?: SortOrder
    delete?: SortOrder
    isdefault?: SortOrder
    userId?: SortOrder
    check?: SortOrder
  }

  export type UseronpageMinOrderByAggregateInput = {
    id?: SortOrder
    roleId?: SortOrder
    username?: SortOrder
    active?: SortOrder
    read?: SortOrder
    create?: SortOrder
    edit?: SortOrder
    link?: SortOrder
    delete?: SortOrder
    isdefault?: SortOrder
    userId?: SortOrder
    check?: SortOrder
  }

  export type UseronpageSumOrderByAggregateInput = {
    id?: SortOrder
    roleId?: SortOrder
    userId?: SortOrder
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UseronpageCreateNestedManyWithoutUserInput = {
    create?: XOR<UseronpageCreateWithoutUserInput, UseronpageUncheckedCreateWithoutUserInput> | UseronpageCreateWithoutUserInput[] | UseronpageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UseronpageCreateOrConnectWithoutUserInput | UseronpageCreateOrConnectWithoutUserInput[]
    createMany?: UseronpageCreateManyUserInputEnvelope
    connect?: UseronpageWhereUniqueInput | UseronpageWhereUniqueInput[]
  }

  export type UseroncompanyCreateNestedManyWithoutUserInput = {
    create?: XOR<UseroncompanyCreateWithoutUserInput, UseroncompanyUncheckedCreateWithoutUserInput> | UseroncompanyCreateWithoutUserInput[] | UseroncompanyUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UseroncompanyCreateOrConnectWithoutUserInput | UseroncompanyCreateOrConnectWithoutUserInput[]
    createMany?: UseroncompanyCreateManyUserInputEnvelope
    connect?: UseroncompanyWhereUniqueInput | UseroncompanyWhereUniqueInput[]
  }

  export type UseronpageUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UseronpageCreateWithoutUserInput, UseronpageUncheckedCreateWithoutUserInput> | UseronpageCreateWithoutUserInput[] | UseronpageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UseronpageCreateOrConnectWithoutUserInput | UseronpageCreateOrConnectWithoutUserInput[]
    createMany?: UseronpageCreateManyUserInputEnvelope
    connect?: UseronpageWhereUniqueInput | UseronpageWhereUniqueInput[]
  }

  export type UseroncompanyUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UseroncompanyCreateWithoutUserInput, UseroncompanyUncheckedCreateWithoutUserInput> | UseroncompanyCreateWithoutUserInput[] | UseroncompanyUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UseroncompanyCreateOrConnectWithoutUserInput | UseroncompanyCreateOrConnectWithoutUserInput[]
    createMany?: UseroncompanyCreateManyUserInputEnvelope
    connect?: UseroncompanyWhereUniqueInput | UseroncompanyWhereUniqueInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UseronpageUpdateManyWithoutUserNestedInput = {
    create?: XOR<UseronpageCreateWithoutUserInput, UseronpageUncheckedCreateWithoutUserInput> | UseronpageCreateWithoutUserInput[] | UseronpageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UseronpageCreateOrConnectWithoutUserInput | UseronpageCreateOrConnectWithoutUserInput[]
    upsert?: UseronpageUpsertWithWhereUniqueWithoutUserInput | UseronpageUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UseronpageCreateManyUserInputEnvelope
    set?: UseronpageWhereUniqueInput | UseronpageWhereUniqueInput[]
    disconnect?: UseronpageWhereUniqueInput | UseronpageWhereUniqueInput[]
    delete?: UseronpageWhereUniqueInput | UseronpageWhereUniqueInput[]
    connect?: UseronpageWhereUniqueInput | UseronpageWhereUniqueInput[]
    update?: UseronpageUpdateWithWhereUniqueWithoutUserInput | UseronpageUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UseronpageUpdateManyWithWhereWithoutUserInput | UseronpageUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UseronpageScalarWhereInput | UseronpageScalarWhereInput[]
  }

  export type UseroncompanyUpdateManyWithoutUserNestedInput = {
    create?: XOR<UseroncompanyCreateWithoutUserInput, UseroncompanyUncheckedCreateWithoutUserInput> | UseroncompanyCreateWithoutUserInput[] | UseroncompanyUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UseroncompanyCreateOrConnectWithoutUserInput | UseroncompanyCreateOrConnectWithoutUserInput[]
    upsert?: UseroncompanyUpsertWithWhereUniqueWithoutUserInput | UseroncompanyUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UseroncompanyCreateManyUserInputEnvelope
    set?: UseroncompanyWhereUniqueInput | UseroncompanyWhereUniqueInput[]
    disconnect?: UseroncompanyWhereUniqueInput | UseroncompanyWhereUniqueInput[]
    delete?: UseroncompanyWhereUniqueInput | UseroncompanyWhereUniqueInput[]
    connect?: UseroncompanyWhereUniqueInput | UseroncompanyWhereUniqueInput[]
    update?: UseroncompanyUpdateWithWhereUniqueWithoutUserInput | UseroncompanyUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UseroncompanyUpdateManyWithWhereWithoutUserInput | UseroncompanyUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UseroncompanyScalarWhereInput | UseroncompanyScalarWhereInput[]
  }

  export type UseronpageUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UseronpageCreateWithoutUserInput, UseronpageUncheckedCreateWithoutUserInput> | UseronpageCreateWithoutUserInput[] | UseronpageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UseronpageCreateOrConnectWithoutUserInput | UseronpageCreateOrConnectWithoutUserInput[]
    upsert?: UseronpageUpsertWithWhereUniqueWithoutUserInput | UseronpageUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UseronpageCreateManyUserInputEnvelope
    set?: UseronpageWhereUniqueInput | UseronpageWhereUniqueInput[]
    disconnect?: UseronpageWhereUniqueInput | UseronpageWhereUniqueInput[]
    delete?: UseronpageWhereUniqueInput | UseronpageWhereUniqueInput[]
    connect?: UseronpageWhereUniqueInput | UseronpageWhereUniqueInput[]
    update?: UseronpageUpdateWithWhereUniqueWithoutUserInput | UseronpageUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UseronpageUpdateManyWithWhereWithoutUserInput | UseronpageUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UseronpageScalarWhereInput | UseronpageScalarWhereInput[]
  }

  export type UseroncompanyUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UseroncompanyCreateWithoutUserInput, UseroncompanyUncheckedCreateWithoutUserInput> | UseroncompanyCreateWithoutUserInput[] | UseroncompanyUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UseroncompanyCreateOrConnectWithoutUserInput | UseroncompanyCreateOrConnectWithoutUserInput[]
    upsert?: UseroncompanyUpsertWithWhereUniqueWithoutUserInput | UseroncompanyUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UseroncompanyCreateManyUserInputEnvelope
    set?: UseroncompanyWhereUniqueInput | UseroncompanyWhereUniqueInput[]
    disconnect?: UseroncompanyWhereUniqueInput | UseroncompanyWhereUniqueInput[]
    delete?: UseroncompanyWhereUniqueInput | UseroncompanyWhereUniqueInput[]
    connect?: UseroncompanyWhereUniqueInput | UseroncompanyWhereUniqueInput[]
    update?: UseroncompanyUpdateWithWhereUniqueWithoutUserInput | UseroncompanyUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UseroncompanyUpdateManyWithWhereWithoutUserInput | UseroncompanyUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UseroncompanyScalarWhereInput | UseroncompanyScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutUseroncompanyInput = {
    create?: XOR<UserCreateWithoutUseroncompanyInput, UserUncheckedCreateWithoutUseroncompanyInput>
    connectOrCreate?: UserCreateOrConnectWithoutUseroncompanyInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutUseroncompanyNestedInput = {
    create?: XOR<UserCreateWithoutUseroncompanyInput, UserUncheckedCreateWithoutUseroncompanyInput>
    connectOrCreate?: UserCreateOrConnectWithoutUseroncompanyInput
    upsert?: UserUpsertWithoutUseroncompanyInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUseroncompanyInput, UserUpdateWithoutUseroncompanyInput>, UserUncheckedUpdateWithoutUseroncompanyInput>
  }

  export type UserCreateNestedOneWithoutUseronpageInput = {
    create?: XOR<UserCreateWithoutUseronpageInput, UserUncheckedCreateWithoutUseronpageInput>
    connectOrCreate?: UserCreateOrConnectWithoutUseronpageInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutUseronpageNestedInput = {
    create?: XOR<UserCreateWithoutUseronpageInput, UserUncheckedCreateWithoutUseronpageInput>
    connectOrCreate?: UserCreateOrConnectWithoutUseronpageInput
    upsert?: UserUpsertWithoutUseronpageInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUseronpageInput, UserUpdateWithoutUseronpageInput>, UserUncheckedUpdateWithoutUseronpageInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type UseronpageCreateWithoutUserInput = {
    roleId?: number | null
    username?: string | null
    active?: boolean | null
    read?: boolean | null
    create?: boolean | null
    edit?: boolean | null
    link?: string | null
    delete?: boolean | null
    isdefault?: boolean | null
    check?: string | null
  }

  export type UseronpageUncheckedCreateWithoutUserInput = {
    id?: number
    roleId?: number | null
    username?: string | null
    active?: boolean | null
    read?: boolean | null
    create?: boolean | null
    edit?: boolean | null
    link?: string | null
    delete?: boolean | null
    isdefault?: boolean | null
    check?: string | null
  }

  export type UseronpageCreateOrConnectWithoutUserInput = {
    where: UseronpageWhereUniqueInput
    create: XOR<UseronpageCreateWithoutUserInput, UseronpageUncheckedCreateWithoutUserInput>
  }

  export type UseronpageCreateManyUserInputEnvelope = {
    data: UseronpageCreateManyUserInput | UseronpageCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UseroncompanyCreateWithoutUserInput = {
    companyName?: string | null
  }

  export type UseroncompanyUncheckedCreateWithoutUserInput = {
    id?: number
    companyName?: string | null
  }

  export type UseroncompanyCreateOrConnectWithoutUserInput = {
    where: UseroncompanyWhereUniqueInput
    create: XOR<UseroncompanyCreateWithoutUserInput, UseroncompanyUncheckedCreateWithoutUserInput>
  }

  export type UseroncompanyCreateManyUserInputEnvelope = {
    data: UseroncompanyCreateManyUserInput | UseroncompanyCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UseronpageUpsertWithWhereUniqueWithoutUserInput = {
    where: UseronpageWhereUniqueInput
    update: XOR<UseronpageUpdateWithoutUserInput, UseronpageUncheckedUpdateWithoutUserInput>
    create: XOR<UseronpageCreateWithoutUserInput, UseronpageUncheckedCreateWithoutUserInput>
  }

  export type UseronpageUpdateWithWhereUniqueWithoutUserInput = {
    where: UseronpageWhereUniqueInput
    data: XOR<UseronpageUpdateWithoutUserInput, UseronpageUncheckedUpdateWithoutUserInput>
  }

  export type UseronpageUpdateManyWithWhereWithoutUserInput = {
    where: UseronpageScalarWhereInput
    data: XOR<UseronpageUpdateManyMutationInput, UseronpageUncheckedUpdateManyWithoutUserInput>
  }

  export type UseronpageScalarWhereInput = {
    AND?: UseronpageScalarWhereInput | UseronpageScalarWhereInput[]
    OR?: UseronpageScalarWhereInput[]
    NOT?: UseronpageScalarWhereInput | UseronpageScalarWhereInput[]
    id?: IntFilter<"Useronpage"> | number
    roleId?: IntNullableFilter<"Useronpage"> | number | null
    username?: StringNullableFilter<"Useronpage"> | string | null
    active?: BoolNullableFilter<"Useronpage"> | boolean | null
    read?: BoolNullableFilter<"Useronpage"> | boolean | null
    create?: BoolNullableFilter<"Useronpage"> | boolean | null
    edit?: BoolNullableFilter<"Useronpage"> | boolean | null
    link?: StringNullableFilter<"Useronpage"> | string | null
    delete?: BoolNullableFilter<"Useronpage"> | boolean | null
    isdefault?: BoolNullableFilter<"Useronpage"> | boolean | null
    userId?: IntFilter<"Useronpage"> | number
    check?: StringNullableFilter<"Useronpage"> | string | null
  }

  export type UseroncompanyUpsertWithWhereUniqueWithoutUserInput = {
    where: UseroncompanyWhereUniqueInput
    update: XOR<UseroncompanyUpdateWithoutUserInput, UseroncompanyUncheckedUpdateWithoutUserInput>
    create: XOR<UseroncompanyCreateWithoutUserInput, UseroncompanyUncheckedCreateWithoutUserInput>
  }

  export type UseroncompanyUpdateWithWhereUniqueWithoutUserInput = {
    where: UseroncompanyWhereUniqueInput
    data: XOR<UseroncompanyUpdateWithoutUserInput, UseroncompanyUncheckedUpdateWithoutUserInput>
  }

  export type UseroncompanyUpdateManyWithWhereWithoutUserInput = {
    where: UseroncompanyScalarWhereInput
    data: XOR<UseroncompanyUpdateManyMutationInput, UseroncompanyUncheckedUpdateManyWithoutUserInput>
  }

  export type UseroncompanyScalarWhereInput = {
    AND?: UseroncompanyScalarWhereInput | UseroncompanyScalarWhereInput[]
    OR?: UseroncompanyScalarWhereInput[]
    NOT?: UseroncompanyScalarWhereInput | UseroncompanyScalarWhereInput[]
    id?: IntFilter<"Useroncompany"> | number
    companyName?: StringNullableFilter<"Useroncompany"> | string | null
    userId?: IntFilter<"Useroncompany"> | number
  }

  export type UserCreateWithoutUseroncompanyInput = {
    roleId?: number | null
    username?: string | null
    employeeId?: number | null
    active?: boolean | null
    password?: string | null
    comCode?: string | null
    Useronpage?: UseronpageCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutUseroncompanyInput = {
    id?: number
    roleId?: number | null
    username?: string | null
    employeeId?: number | null
    active?: boolean | null
    password?: string | null
    comCode?: string | null
    Useronpage?: UseronpageUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutUseroncompanyInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUseroncompanyInput, UserUncheckedCreateWithoutUseroncompanyInput>
  }

  export type UserUpsertWithoutUseroncompanyInput = {
    update: XOR<UserUpdateWithoutUseroncompanyInput, UserUncheckedUpdateWithoutUseroncompanyInput>
    create: XOR<UserCreateWithoutUseroncompanyInput, UserUncheckedCreateWithoutUseroncompanyInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUseroncompanyInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUseroncompanyInput, UserUncheckedUpdateWithoutUseroncompanyInput>
  }

  export type UserUpdateWithoutUseroncompanyInput = {
    roleId?: NullableIntFieldUpdateOperationsInput | number | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    employeeId?: NullableIntFieldUpdateOperationsInput | number | null
    active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    comCode?: NullableStringFieldUpdateOperationsInput | string | null
    Useronpage?: UseronpageUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutUseroncompanyInput = {
    id?: IntFieldUpdateOperationsInput | number
    roleId?: NullableIntFieldUpdateOperationsInput | number | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    employeeId?: NullableIntFieldUpdateOperationsInput | number | null
    active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    comCode?: NullableStringFieldUpdateOperationsInput | string | null
    Useronpage?: UseronpageUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutUseronpageInput = {
    roleId?: number | null
    username?: string | null
    employeeId?: number | null
    active?: boolean | null
    password?: string | null
    comCode?: string | null
    Useroncompany?: UseroncompanyCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutUseronpageInput = {
    id?: number
    roleId?: number | null
    username?: string | null
    employeeId?: number | null
    active?: boolean | null
    password?: string | null
    comCode?: string | null
    Useroncompany?: UseroncompanyUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutUseronpageInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUseronpageInput, UserUncheckedCreateWithoutUseronpageInput>
  }

  export type UserUpsertWithoutUseronpageInput = {
    update: XOR<UserUpdateWithoutUseronpageInput, UserUncheckedUpdateWithoutUseronpageInput>
    create: XOR<UserCreateWithoutUseronpageInput, UserUncheckedCreateWithoutUseronpageInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUseronpageInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUseronpageInput, UserUncheckedUpdateWithoutUseronpageInput>
  }

  export type UserUpdateWithoutUseronpageInput = {
    roleId?: NullableIntFieldUpdateOperationsInput | number | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    employeeId?: NullableIntFieldUpdateOperationsInput | number | null
    active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    comCode?: NullableStringFieldUpdateOperationsInput | string | null
    Useroncompany?: UseroncompanyUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutUseronpageInput = {
    id?: IntFieldUpdateOperationsInput | number
    roleId?: NullableIntFieldUpdateOperationsInput | number | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    employeeId?: NullableIntFieldUpdateOperationsInput | number | null
    active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    comCode?: NullableStringFieldUpdateOperationsInput | string | null
    Useroncompany?: UseroncompanyUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UseronpageCreateManyUserInput = {
    id?: number
    roleId?: number | null
    username?: string | null
    active?: boolean | null
    read?: boolean | null
    create?: boolean | null
    edit?: boolean | null
    link?: string | null
    delete?: boolean | null
    isdefault?: boolean | null
    check?: string | null
  }

  export type UseroncompanyCreateManyUserInput = {
    id?: number
    companyName?: string | null
  }

  export type UseronpageUpdateWithoutUserInput = {
    roleId?: NullableIntFieldUpdateOperationsInput | number | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    read?: NullableBoolFieldUpdateOperationsInput | boolean | null
    create?: NullableBoolFieldUpdateOperationsInput | boolean | null
    edit?: NullableBoolFieldUpdateOperationsInput | boolean | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    delete?: NullableBoolFieldUpdateOperationsInput | boolean | null
    isdefault?: NullableBoolFieldUpdateOperationsInput | boolean | null
    check?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UseronpageUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    roleId?: NullableIntFieldUpdateOperationsInput | number | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    read?: NullableBoolFieldUpdateOperationsInput | boolean | null
    create?: NullableBoolFieldUpdateOperationsInput | boolean | null
    edit?: NullableBoolFieldUpdateOperationsInput | boolean | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    delete?: NullableBoolFieldUpdateOperationsInput | boolean | null
    isdefault?: NullableBoolFieldUpdateOperationsInput | boolean | null
    check?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UseronpageUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    roleId?: NullableIntFieldUpdateOperationsInput | number | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    read?: NullableBoolFieldUpdateOperationsInput | boolean | null
    create?: NullableBoolFieldUpdateOperationsInput | boolean | null
    edit?: NullableBoolFieldUpdateOperationsInput | boolean | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    delete?: NullableBoolFieldUpdateOperationsInput | boolean | null
    isdefault?: NullableBoolFieldUpdateOperationsInput | boolean | null
    check?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UseroncompanyUpdateWithoutUserInput = {
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UseroncompanyUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UseroncompanyUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}