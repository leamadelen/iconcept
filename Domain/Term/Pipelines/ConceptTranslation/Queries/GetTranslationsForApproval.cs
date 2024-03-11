// FeelingPipeline.cs

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using iconcept.Infrastructure;

using iconcept.Domain.Term;

namespace iconcept.Domain.Term.Pipelines;
public class GetTranslationsForApprovalPipeline
{
    public record Request() : IRequest<List<ConceptTranslationDto>> { }

    public class Handler : IRequestHandler<Request, List<ConceptTranslationDto>>
    {
        private readonly ConceptDbContext _db;

        public Handler(ConceptDbContext db)
        {
            _db = db ?? throw new ArgumentNullException(nameof(db));
        }

        public async Task<List<ConceptTranslationDto>> Handle(Request request, CancellationToken cancellationToken)
            => await _db.ConceptTranslations
            .Include(c => c.Religions)
            .Include(c => c.Regions)
            .Include(c => c.Countries)
            .Where(c => c.Status != Status.Approved)
            .Select(ct => new ConceptTranslationDto
            {
                Id = ct.Id,
                NorwegianDefinition = ct.NorwegianDefinition,
                Context = ct.Context,
                Translation = ct.Translation,
                Status = ct.Status,
                LastModified = ct.LastModified,
                EditedTranslation = ct.EditedTranslation,
                Comment = ct.Comment,
                Regions = ct.Regions.Select(r => new RegionDto { RegionId = r.Id, RegionName = r.RegionName }).ToList(),
                Countries = ct.Countries.Select(c => new CountryDto { CountryId = c.Id, CountryName = c.CountryName }).ToList(),
                Religions = ct.Religions.Select(r => new ReligionDto { ReligionId = r.Id, ReligionName = r.ReligionName }).ToList(),
                Feelings = ct.Feelings.Select(f => new FeelingDto { FeelingId = f.Id, FeelingName = f.FeelingName }).ToList(),
                TermName = _db.Terms.FirstOrDefault(term => term.Id == ct.TermId)!.TermName
            })
            .ToListAsync(cancellationToken);
    }

}