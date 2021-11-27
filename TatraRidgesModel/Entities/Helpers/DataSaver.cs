namespace TatraRidges.Model.Entities.Helpers;

public class DataSaver
{
    private readonly TatraDbContext _context;

    private DataSaver(TatraDbContext context) => _context = context;

    public static void SaveWhenEmpty<TEntity>(TatraDbContext context, List<TEntity> data) where TEntity : class
    {
        var instance = new DataSaver(context);

        if (!instance.CheckIsEmptyTable<TEntity>())
        {
            instance.Save(data);
        }
    }

    private void Save<TEntity>(List<TEntity> data) where TEntity : class
    {
        var dbSet = _context.Set<TEntity>();

        if (dbSet != null)
        {
            dbSet.AddRange(data);
            _context.SaveChanges();
        }
        else
        {
            throw new Exception($"Table of {nameof(TEntity)} not found");
        }
    }
    public bool CheckIsEmptyTable<TEntity>()
    {
        var table=GetTable<TEntity>();
        return table != null && table.Any();
    }

    private IQueryable<TEntity>? GetTable<TEntity>()
    {
        var property = _context.GetType().GetProperties().FirstOrDefault(IsThisType<TEntity>);

        return property == null ? null
            : property.GetValue(_context) as IQueryable<TEntity>;
    }
    private static bool IsThisType<TEntity>(System.Reflection.PropertyInfo propertyInfo)
    {
        var nameEntities = typeof(TEntity).FullName;
        var namePropertyType = propertyInfo.PropertyType.FullName;

        return nameEntities != null
                && namePropertyType != null
                && namePropertyType.Contains("DbSet")
                && namePropertyType.Contains(nameEntities);
    }
}

