# Generated by Django 2.2.2 on 2019-06-23 14:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('document', '0007_auto_20190227_2105'),
    ]

    operations = [
        migrations.AddField(
            model_name='documenttemplate',
            name='doc_version',
            field=models.DecimalField(decimal_places=1, default=3.0, max_digits=3),
        ),
    ]