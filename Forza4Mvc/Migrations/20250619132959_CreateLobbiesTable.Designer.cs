﻿// <auto-generated />
using System;
using Forza4Mvc.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Forza4Mvc.Migrations
{
    [DbContext(typeof(Forza4DbContext))]
    [Migration("20250619132959_CreateLobbiesTable")]
    partial class CreateLobbiesTable
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.6")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Forza4Mvc.Models.Forza4Lobby", b =>
                {
                    b.Property<string>("LobbyId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("CurrentTurn")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Guest")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Host")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("LobbyId");

                    b.ToTable("Lobbies");
                });
#pragma warning restore 612, 618
        }
    }
}
