using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TatraRidges.Model.Migrations
{
    public partial class ChangeOneColumnName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DescriptionId",
                table: "DescriptionAdjectivePairs");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DescriptionId",
                table: "DescriptionAdjectivePairs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
