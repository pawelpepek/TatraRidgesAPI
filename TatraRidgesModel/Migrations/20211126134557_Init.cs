using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TatraRidges.Model.Migrations
{
    public partial class Init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Adjectives",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    Text = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Rank = table.Column<short>(type: "smallint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Adjectives", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Difficulties",
                columns: table => new
                {
                    Id = table.Column<byte>(type: "tinyint", nullable: false),
                    Text = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Difficulties", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DifficultyDetails",
                columns: table => new
                {
                    Id = table.Column<byte>(type: "tinyint", nullable: false),
                    Sign = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DifficultyDetails", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Guides",
                columns: table => new
                {
                    Id = table.Column<byte>(type: "tinyint", nullable: false),
                    ShortName = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Author = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Guides", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PointTypes",
                columns: table => new
                {
                    Id = table.Column<byte>(type: "tinyint", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PointTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RouteTypes",
                columns: table => new
                {
                    Id = table.Column<byte>(type: "tinyint", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Rank = table.Column<byte>(type: "tinyint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RouteTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GuideDescriptions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Number = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Page = table.Column<short>(type: "smallint", nullable: false),
                    Volume = table.Column<short>(type: "smallint", nullable: false),
                    GuideId = table.Column<byte>(type: "tinyint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuideDescriptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuideDescriptions_Guides_GuideId",
                        column: x => x.GuideId,
                        principalTable: "Guides",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MountainPoints",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PointTypeId = table.Column<byte>(type: "tinyint", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    AlternativeName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Evaluation = table.Column<short>(type: "smallint", nullable: true),
                    PrecisedEvaluation = table.Column<bool>(type: "bit", nullable: false),
                    WikiLatitude = table.Column<decimal>(type: "decimal(8,6)", nullable: false),
                    WikiLongitude = table.Column<decimal>(type: "decimal(8,6)", nullable: false),
                    Latitude = table.Column<decimal>(type: "decimal(8,6)", nullable: false),
                    Longitude = table.Column<decimal>(type: "decimal(8,6)", nullable: false),
                    WikiAddress = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MountainPoints", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MountainPoints_PointTypes_PointTypeId",
                        column: x => x.PointTypeId,
                        principalTable: "PointTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PointsConnections",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PointId1 = table.Column<int>(type: "int", nullable: false),
                    PointId2 = table.Column<int>(type: "int", nullable: false),
                    Ridge = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PointsConnections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PointsConnections_MountainPoints_PointId1",
                        column: x => x.PointId1,
                        principalTable: "MountainPoints",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PointsConnections_MountainPoints_PointId2",
                        column: x => x.PointId2,
                        principalTable: "MountainPoints",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Routes",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PointsConnectionId = table.Column<long>(type: "bigint", nullable: false),
                    ConsistentDirection = table.Column<bool>(type: "bit", nullable: false),
                    DifficultyId = table.Column<byte>(type: "tinyint", nullable: false),
                    DifficultyDetailId = table.Column<byte>(type: "tinyint", nullable: false),
                    Rappeling = table.Column<bool>(type: "bit", nullable: false),
                    RouteTypeId = table.Column<byte>(type: "tinyint", nullable: false),
                    GuideDescriptionId = table.Column<int>(type: "int", nullable: false),
                    RouteTime = table.Column<TimeSpan>(type: "time", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Routes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Routes_Difficulties_DifficultyId",
                        column: x => x.DifficultyId,
                        principalTable: "Difficulties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Routes_DifficultyDetails_DifficultyDetailId",
                        column: x => x.DifficultyDetailId,
                        principalTable: "DifficultyDetails",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Routes_GuideDescriptions_GuideDescriptionId",
                        column: x => x.GuideDescriptionId,
                        principalTable: "GuideDescriptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Routes_PointsConnections_PointsConnectionId",
                        column: x => x.PointsConnectionId,
                        principalTable: "PointsConnections",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Routes_RouteTypes_RouteTypeId",
                        column: x => x.RouteTypeId,
                        principalTable: "RouteTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DescriptionAdjectivePairs",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RouteId = table.Column<long>(type: "bigint", nullable: false),
                    DescriptionId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AdjectiveId = table.Column<string>(type: "nvarchar(2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DescriptionAdjectivePairs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DescriptionAdjectivePairs_Adjectives_AdjectiveId",
                        column: x => x.AdjectiveId,
                        principalTable: "Adjectives",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DescriptionAdjectivePairs_Routes_RouteId",
                        column: x => x.RouteId,
                        principalTable: "Routes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DescriptionAdjectivePairs_AdjectiveId",
                table: "DescriptionAdjectivePairs",
                column: "AdjectiveId");

            migrationBuilder.CreateIndex(
                name: "IX_DescriptionAdjectivePairs_RouteId",
                table: "DescriptionAdjectivePairs",
                column: "RouteId");

            migrationBuilder.CreateIndex(
                name: "IX_GuideDescriptions_GuideId",
                table: "GuideDescriptions",
                column: "GuideId");

            migrationBuilder.CreateIndex(
                name: "IX_MountainPoints_PointTypeId",
                table: "MountainPoints",
                column: "PointTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_PointsConnections_PointId1",
                table: "PointsConnections",
                column: "PointId1");

            migrationBuilder.CreateIndex(
                name: "IX_PointsConnections_PointId2",
                table: "PointsConnections",
                column: "PointId2");

            migrationBuilder.CreateIndex(
                name: "IX_Routes_DifficultyDetailId",
                table: "Routes",
                column: "DifficultyDetailId");

            migrationBuilder.CreateIndex(
                name: "IX_Routes_DifficultyId",
                table: "Routes",
                column: "DifficultyId");

            migrationBuilder.CreateIndex(
                name: "IX_Routes_GuideDescriptionId",
                table: "Routes",
                column: "GuideDescriptionId");

            migrationBuilder.CreateIndex(
                name: "IX_Routes_PointsConnectionId",
                table: "Routes",
                column: "PointsConnectionId");

            migrationBuilder.CreateIndex(
                name: "IX_Routes_RouteTypeId",
                table: "Routes",
                column: "RouteTypeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DescriptionAdjectivePairs");

            migrationBuilder.DropTable(
                name: "Adjectives");

            migrationBuilder.DropTable(
                name: "Routes");

            migrationBuilder.DropTable(
                name: "Difficulties");

            migrationBuilder.DropTable(
                name: "DifficultyDetails");

            migrationBuilder.DropTable(
                name: "GuideDescriptions");

            migrationBuilder.DropTable(
                name: "PointsConnections");

            migrationBuilder.DropTable(
                name: "RouteTypes");

            migrationBuilder.DropTable(
                name: "Guides");

            migrationBuilder.DropTable(
                name: "MountainPoints");

            migrationBuilder.DropTable(
                name: "PointTypes");
        }
    }
}
